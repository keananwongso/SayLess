import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { landingSample, countLandingFillers, firstCounts, retryCounts, firstTotal, retryTotal, reductionPercent } from "../src/lib/landing-sample.ts";

test("sample figures are derived from equal-length, explicitly synthetic transcripts", () => {
  assert.equal(landingSample.seconds, 60);
  assert.equal(landingSample.first.length, 6);
  assert.equal(landingSample.retry.length, 6);
  assert.deepEqual(firstCounts, [2, 1, 2, 1, 1, 1]);
  assert.deepEqual(retryCounts, [0, 0, 1, 0, 0, 1]);
  assert.equal(firstTotal, 8);
  assert.equal(retryTotal, 2);
  assert.equal(reductionPercent, 75);
});

test("filler counting uses whole words, ignores case, and handles zero", () => {
  assert.equal(countLandingFillers("Um, UH. um!"), 3);
  assert.equal(countLandingFillers("summer thumb human"), 0);
  assert.equal(countLandingFillers(""), 0);
});

test("landing preview has no audio player or audio fixture dependency", () => {
  const component = readFileSync(new URL("../src/components/landing-preview.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(component, /<audio|sample-pitches|voice-samples/);
  assert.match(component, /Synthetic sample/);
  assert.match(component, /not that source or a study/);
});
