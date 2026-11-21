# Practice API and request tracing

## Request

`POST /api/practice` accepts a multipart `audio` file up to 4 MB. The route accepts WebM, Ogg, MP4/M4A, WAV, and MP3 audio.

```bash
curl -i -F 'audio=@public/voice-samples/alex-first.m4a;type=audio/mp4' \
  http://localhost:3000/api/practice
```

Set `DEEPGRAM_API_KEY` in the server environment to enable Nova-3 with filler retention and word timestamps. `OPENAI_API_KEY` enables the coaching cue and the existing transcript-only service when no Deepgram key is configured. With Deepgram alone, SayLess uses a stock cue. The browser retains audio and current practice history in the tab for playback and comparison.

For a recording upload from `/app`, send a second multipart field, `mode=analysis`. This returns `{ transcript, events?, durationSeconds? }` and skips the pitch coaching call. Counts cover the whole recording. The browser computes repeated words and phrases from the transcript and plays each timestamped event from the selected file.

## Production rate limit

The Vercel Firewall allows 12 requests per 60-second window per IP to `/api/practice`. The limit covers both practice and analysis uploads. Excess requests receive HTTP 429 at the edge before reaching the transcription and coaching providers. Manage the rule under **Practice API rate limit** in the SayLess project’s Firewall settings.

## Response

All route responses include `X-Request-Id`. Here is a synthetic successful result:

```json
{
  "transcript": "Um, SayLess helps students rehearse. Um, it gives them one suggestion.",
  "suggestion": "Try a brief pause when you feel an “um” coming.",
  "events": [
    { "kind": "filler", "startMs": 200, "endMs": 532, "text": "um" },
    { "kind": "filler", "startMs": 3598, "endMs": 3931, "text": "um" }
  ]
}
```

Times are milliseconds from the start of the original recording. An empty `events` array means the timed transcript had zero supported fillers. An absent field means timestamped evidence is unavailable:

```json
{
  "transcript": "SayLess helps students rehearse.",
  "suggestion": "Lead with who your project helps and what it helps them do."
}
```

A coaching failure still returns HTTP 200 with the transcript, any events, and a stock cue. Input and transcription errors return `{ "error": "..." }` and an appropriate HTTP status.

The browser derives the next rule from the latest timed transcript. For example, a baseline with three “ums” activates `{ "target": "um", "baselineCount": 3 }`. If the retry has one “um” and two “uhs,” the comparison displays `um: 3 → 1` and the next rule becomes `{ "target": "uh", "baselineCount": 2 }`.

## Find a request in Vercel

Open the browser’s **Network** panel, select `POST /api/practice`, and copy the `X-Request-Id` response header. Search the deployment’s **Runtime Logs** for that exact value in a `practice.completed` message. From the CLI, search log messages using `vercel logs --query '<X-Request-Id>'`. The route's UUID is separate from Vercel's own request identifier.

A synthetic log entry looks like this:

```json
{
  "event": "practice.completed",
  "requestId": "bc5af08a-202c-4361-85ed-72e2bcb88e55",
  "provider": "deepgram",
  "mode": "practice",
  "status": 200,
  "outcome": "degraded",
  "failedStage": "coaching",
  "transcriptionMs": 1260,
  "coachingMs": 840,
  "totalMs": 2125,
  "eventCount": 2
}
```

Log timings are milliseconds. Runtime logs contain processing metadata. The response and browser session carry the transcript, clips, and coaching text.
