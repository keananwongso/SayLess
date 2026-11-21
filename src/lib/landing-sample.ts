// Illustrative fixture, not measured customer performance or a research result.
// Both takes use equal 60-second windows so their counts are comparable.
export const landingSample = {
  name: "Alex",
  seconds: 60,
  first: [
    "Um, we built a tool that helps students, uh, prepare for presentations.",
    "It listens to a short pitch and, um, spots the words you repeat.",
    "Um, you can see your transcript and, uh, find a place to pause.",
    "The feedback gives you, um, one specific change to practice next.",
    "Then you record again and compare, um, the two versions side by side.",
    "The goal is to feel prepared and, um, explain your idea in your own voice.",
  ],
  retry: [
    "SayLess helps students prepare for presentations with a short practice pitch.",
    "It highlights repeated words in a transcript so you can spot your habits.",
    "You get one suggestion, um, such as pausing before your next thought.",
    "Try that suggestion in a second take without rewriting your whole pitch.",
    "Compare both versions to see which change worked for you.",
    "It is a small rehearsal to help you, um, explain your idea in your own voice.",
  ],
} as const;

export function countLandingFillers(text: string): number {
  return text.match(/\b(?:um|uh)\b/gi)?.length ?? 0;
}

export const firstCounts = landingSample.first.map(countLandingFillers);
export const retryCounts = landingSample.retry.map(countLandingFillers);
export const firstTotal = firstCounts.reduce((sum, count) => sum + count, 0);
export const retryTotal = retryCounts.reduce((sum, count) => sum + count, 0);
export const reductionPercent = Math.round((1 - retryTotal / firstTotal) * 100);
