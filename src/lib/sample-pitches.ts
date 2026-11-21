import type { Take } from "./practice";

export const sampleProfiles: { name: string; takes: [Take, Take] }[] = [
  {
    name: "Alex",
    takes: [
      {
        transcript: "Um, I built a tool for students who get nervous presenting. Um, it listens to a short pitch and um, gives them one thing to try.",
        seconds: 7.93,
        suggestion: "Try a brief pause when you feel an “um” coming.",
        events: [
          { kind: "filler", startMs: 200, endMs: 532, text: "um" },
          { kind: "filler", startMs: 3598, endMs: 3931, text: "um" },
          { kind: "filler", startMs: 5882, endMs: 6215, text: "um" },
        ],
        audio: "/voice-samples/alex-first.m4a",
      },
      {
        transcript: "SayLess helps students rehearse short presentations. Um, it listens to a pitch and suggests one thing to try next.",
        seconds: 6.959,
        suggestion: "Your opening names the audience. Keep that first sentence short and give one example.",
        events: [
          { kind: "filler", startMs: 3235, endMs: 3568, text: "um" },
        ],
        audio: "/voice-samples/alex-retry.m4a",
      },
    ],
  },
  {
    name: "Sam",
    takes: [
      {
        transcript: "Uh, we built a practice tool for first-time founders. Uh, it helps them explain their idea clearly.",
        seconds: 6.153,
        suggestion: "Try a brief pause when you feel an “uh” coming.",
        events: [
          { kind: "filler", startMs: 200, endMs: 377, text: "uh" },
          { kind: "filler", startMs: 3413, endMs: 3591, text: "uh" },
        ],
        audio: "/voice-samples/sam-first.m4a",
      },
      {
        transcript: "SayLess helps first-time founders practice their pitch. Uh, they record one short take and get a suggestion for the next one.",
        seconds: 7.475,
        suggestion: "Lead with the audience, then give one concrete example of the feedback.",
        events: [
          { kind: "filler", startMs: 3429, endMs: 3607, text: "uh" },
        ],
        audio: "/voice-samples/sam-retry.m4a",
      },
    ],
  },
];
