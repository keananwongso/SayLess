// Illustrative fixture, not measured customer performance or a research result.
// Both takes use equal 60-second windows so their counts are comparable.
export const landingSample = {
  name: "Alex",
  seconds: 60,
  first: [
    "Um, we built a tool that helps students, uh, prepare for presentations.",
    "It listens to a short pitch and, like, spots the words you repeat.",
    "Wait, you can see your transcript and, uh, find a place to pause.",
    "The feedback gives you, like, one specific change to practice next.",
    "Then you record again and compare, well, the two versions side by side.",
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
  // Only for authored fixture hesitations, not general-purpose classification.
  return text.match(/\b(?:um|uh|like|wait|well)\b/gi)?.length ?? 0;
}

export const firstCounts = landingSample.first.map(countLandingFillers);
export const retryCounts = landingSample.retry.map(countLandingFillers);
export const firstTotal = firstCounts.reduce((sum, count) => sum + count, 0);
export const retryTotal = retryCounts.reduce((sum, count) => sum + count, 0);
export const reductionPercent = Math.round((1 - retryTotal / firstTotal) * 100);

// Authored timing, not an alignment result. Each event matches its transcript segment.
export const fillerEvents = {
  first: [
    { word: "um", start: 0.8, end: 1.5 }, { word: "uh", start: 6.4, end: 7 },
    { word: "like", start: 15.2, end: 16 }, { word: "wait", start: 20.6, end: 21.3 },
    { word: "uh", start: 26.1, end: 26.8 }, { word: "like", start: 34.4, end: 35.1 },
    { word: "well", start: 45.2, end: 46 }, { word: "um", start: 54.3, end: 55.1 },
  ],
  retry: [{ word: "um", start: 23.2, end: 23.8 }, { word: "um", start: 55.1, end: 55.7 }],
} as const;

// Authored trajectory with plateaus and setbacks, not a predictive model.
export function practiceJourney(reduction: number) {
  const target = firstTotal * (1 - reduction / 100);
  const sample = [8, 7.2, 7.7, 6.4, 6.4];
  const progress = [0.1, 0.27, 0.23, 0.48, 0.48, 0.72, 0.87, 1];
  return [...sample, ...progress.map(fraction => Math.round((6.4 + (target - 6.4) * fraction) * 10) / 10)];
}
