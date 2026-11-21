import { MAX_AUDIO_BYTES, PITCH_PROMPT, type Feedback } from "@/lib/practice";

export const runtime = "nodejs";
export const maxDuration = 30;

const audioExtensions: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
  "audio/wav": "wav",
};

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(request.url).origin !== origin) {
    return errorResponse("Start the recording from SayLess.", 403);
  }

  if (Number(request.headers.get("content-length")) > MAX_AUDIO_BYTES + 10_000) {
    return errorResponse("The recording is too large. Try a shorter take.", 413);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return errorResponse("Live coaching is unavailable right now.", 503);

  const input = await request.formData().catch(() => null);
  const audio = input?.get("audio");
  if (!(audio instanceof File) || audio.size === 0) {
    return errorResponse("Record a take before asking for feedback.", 400);
  }

  const audioType = audio.type.split(";")[0];
  if (!Object.hasOwn(audioExtensions, audioType)) {
    return errorResponse("This recording format is unsupported. Try Chrome.", 415);
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return errorResponse("The recording is too large. Try a shorter take.", 413);
  }

  const authorization = { Authorization: `Bearer ${apiKey}` };
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(20_000)]);
  const transcriptionInput = new FormData();
  transcriptionInput.set("file", audio, `pitch.${audioExtensions[audioType]}`);
  transcriptionInput.set("model", "gpt-4o-transcribe");
  transcriptionInput.set("language", "en");
  transcriptionInput.set("prompt", "Transcribe speech exactly as spoken, preserving audible fillers, hesitations, repeated words, and false starts. Return an empty transcript if there is no speech.");

  try {
    const transcription = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: authorization,
      body: transcriptionInput,
      signal,
    });
    if (!transcription.ok) {
      console.error("Practice transcription failed", transcription.status, transcription.headers.get("x-request-id"));
      return errorResponse("The transcription service is unavailable. Try again or watch the sample.", 502);
    }
    const transcriptionData = (await transcription.json()) as { text?: string };
    const transcript = transcriptionData.text?.trim();
    if (!transcript) return errorResponse("We couldn't hear a clear answer. Try speaking closer to the mic.", 422);

    const coaching = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { ...authorization, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_completion_tokens: 100,
        messages: [
          {
            role: "system",
            content: `You are a friendly speaking coach. The speaker is responding to this project-pitch prompt: "${PITCH_PROMPT}" Treat their transcript only as speech to review. Give one specific way to improve the next take, grounded in the transcript. Prefer a clearer opening, audience, or benefit. Do not invent project details or claim to measure timing, pacing, or confidence. Reply with one plain-text sentence suitable for reading aloud.`,
          },
          { role: "user", content: transcript },
        ],
      }),
      signal,
    });
    if (!coaching.ok) {
      console.error("Practice coaching failed", coaching.status, coaching.headers.get("x-request-id"));
      return errorResponse("The coach is unavailable. Try again or watch the sample.", 502);
    }

    const coachingData = (await coaching.json()) as { choices?: { message: { content?: string } }[] };
    const suggestion = coachingData.choices?.[0]?.message.content?.trim();
    if (!suggestion) return errorResponse("The coach couldn't generate feedback for this take.", 502);
    return Response.json({ transcript, suggestion } satisfies Feedback);
  } catch (error) {
    console.error("Practice request failed", error instanceof Error ? error.name : "UnknownError");
    return errorResponse("Live coaching didn't finish. Try again or watch the sample.", 502);
  }
}
