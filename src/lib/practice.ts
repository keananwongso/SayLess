export const PITCH_PROMPT = "What did you build, who is it for, and why should they care?";
export const MAX_RECORDING_SECONDS = 20;
export const MAX_AUDIO_BYTES = 4_000_000;

export type Filler = "um" | "uh";

export type FillerEvent = {
  kind: "filler";
  startMs: number;
  endMs: number;
  text: Filler;
};

export type RecordingAnalysis = {
  transcript: string;
  events?: FillerEvent[];
  durationSeconds?: number;
};

export type Feedback = Omit<RecordingAnalysis, "durationSeconds"> & { suggestion: string };

export type Take = Feedback & {
  seconds: number;
  audio?: Blob | string;
};

export type CoachingRule = {
  target: Filler;
  baselineCount: number;
};

export type PracticeSession = {
  takes: [Take, Take?];
  attempt: number;
  appliedRule?: CoachingRule;
  nextRule?: CoachingRule;
};

export function normalizeFiller(text: string): Filler | undefined {
  const word = text.trim().toLowerCase().replace(/^\p{P}+|\p{P}+$/gu, "");
  if (/^um+$/.test(word)) return "um";
  if (/^uh+$/.test(word)) return "uh";
  return undefined;
}

export function fillerCounts<T extends string>(fillers: T[]) {
  const counts = new Map<T, number>();
  for (const filler of fillers) {
    counts.set(filler, (counts.get(filler) ?? 0) + 1);
  }
  return counts;
}

export function chooseRule(events: FillerEvent[]): CoachingRule | undefined {
  const counts = fillerCounts(events.map(({ text }) => text));
  let rule: CoachingRule | undefined;
  for (const [target, count] of counts) {
    if (count < 2 || (rule && count <= rule.baselineCount)) continue;
    rule = { target, baselineCount: count };
  }
  return rule;
}

export function nextTake(previous: PracticeSession | undefined, take: Take): PracticeSession {
  const latest = previous && (previous.takes[1] ?? previous.takes[0]);

  return {
    takes: latest ? [latest, take] : [take],
    attempt: (previous?.attempt ?? 0) + 1,
    appliedRule: latest?.events && take.events ? previous?.nextRule : undefined,
    nextRule: take.events ? chooseRule(take.events) : previous?.nextRule,
  };
}

export function stockCue(rule?: CoachingRule) {
  return rule
    ? `Try a brief pause when you feel an “${rule.target}” coming.`
    : "Lead with who your project helps and what it helps them do.";
}

function tokens(transcript: string) {
  return transcript.toLowerCase().match(/\p{L}+(?:['’]\p{L}+)*/gu) ?? [];
}

export function pitchMetrics({ transcript, seconds, events }: Take) {
  const words = tokens(transcript);
  const fillers = events
    ? events.map(({ text }) => text)
    : words.filter((word) => /^(um+|uh+|erm+|er+|ah+|hmm+)$/.test(word));
  return {
    fillers,
    pace: Math.round(words.length * 60 / seconds),
  };
}
