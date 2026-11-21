import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { landingSample, countLandingFillers, firstCounts, retryCounts, firstTotal, retryTotal, reductionPercent, fillerEvents, practiceJourney } from "../src/lib/landing-sample.ts";

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
  assert.equal(countLandingFillers("Like, wait, well…"), 3);
  assert.equal(countLandingFillers("summer thumb human"), 0);
  assert.equal(countLandingFillers(""), 0);
});

test("landing preview has no audio player or audio fixture dependency", () => {
  const component = readFileSync(new URL("../src/components/landing-preview.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(component, /<audio|sample-pitches|voice-samples/);
  assert.doesNotMatch(component, /Illustrative sample|Small words\. A visible pattern\.|First take · 60 seconds/);
  assert.doesNotMatch(component, /<details|<summary/);
});

test("authored timestamps match filler order, counts, and equal timeline windows", () => {
  for (const take of ["first", "retry"]) {
    const events = fillerEvents[take];
    let previous = -1;
    for (const event of events) {
      assert.ok(event.start > previous && event.end > event.start && event.end <= 60);
      previous = event.end;
    }
    landingSample[take].forEach((segment, index) => {
      assert.deepEqual(events.filter(event => Math.floor(event.start / 10) === index).map(event => event.word), segment.toLowerCase().match(/\b(?:um|uh|like|wait|well)\b/g) ?? []);
    });
  }
});

test("goal milestones use the selected reduction, not invented performance data", () => {
  for (const target of [25, 50, 75]) {
    const values = practiceJourney(target);
    assert.equal(values.length, 13);
    assert.equal(values[0], 8);
    assert.equal(values.at(-1), 8 * (1 - target / 100));
    assert.ok(values.some((value, index) => index > 0 && value > values[index - 1]));
    assert.ok(values.some((value, index) => index > 0 && value === values[index - 1]));
    assert.ok(values.every(value => value >= 0 && value <= 8));
  }
});

test("autoplay retains pause and reduced-motion safeguards without a seek control", () => {
  const component = readFileSync(new URL("../src/components/landing-graphs.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(component, /type="range"|<audio|playhead/);
  assert.doesNotMatch(component, /60s take · silent 3× preview/);
  assert.match(component, /prefers-reduced-motion/);
  assert.match(component, /document.hidden/);
  assert.match(component, /clearInterval/);
  assert.match(component, /"Resume" : "Pause"/);
});

test("landing previews use compact layouts without hiding core charts", () => {
  const layout = readFileSync(new URL("../src/app/landing.module.css", import.meta.url), "utf8");
  const graphs = readFileSync(new URL("../src/components/landing-graphs.module.css", import.meta.url), "utf8");
  const component = readFileSync(new URL("../src/components/landing-graphs.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(layout, /min-height: 5[12]0px/);
  assert.match(graphs, /height: 48px/);
  assert.match(graphs, /\.mobileChart/);
  assert.match(component, /Illustrative goal/);
  assert.doesNotMatch(component, /<details|<summary|type="range"/);
  assert.match(component, /Math.min\(60, value \+ .3\)/);
});
