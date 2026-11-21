export const PITCH_PROMPT = "What did you build, who is it for, and why should they care?";
export const MAX_RECORDING_SECONDS = 20;
export const MAX_AUDIO_BYTES = 4_000_000;

export type Feedback = {
  transcript: string;
  suggestion: string;
};

export type Take = Feedback & { seconds: number };

function tokens(transcript: string) {
  return transcript.toLowerCase().match(/\p{L}+(?:['’]\p{L}+)*/gu) ?? [];
}

export function pitchMetrics({ transcript, seconds }: Take) {
  const words = tokens(transcript);
  const fillers = words.filter((word) => /^(um+|uh+|erm+|er+|ah+|hmm+)$/.test(word));
  return {
    fillers,
    pace: Math.round(words.length * 60 / seconds),
  };
}
