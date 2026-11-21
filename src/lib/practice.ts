export const PITCH_PROMPT = "What did you build, who is it for, and why should they care?";
export const MAX_RECORDING_SECONDS = 20;
export const MAX_AUDIO_BYTES = 4_000_000;

export type Feedback = {
  transcript: string;
  suggestion: string;
};

export type Take = Feedback & { seconds: number };
