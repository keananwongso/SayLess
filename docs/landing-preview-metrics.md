# Landing preview metrics

The landing preview is a synthetic, authored example. It does not use customer recordings, scientific study measurements, or the app's live analysis route.

- Two illustrative 60-second takes are split into six authored 10-second segments. These are not timestamped audio measurements.
- Whole-word “um,” “uh,” “like,” “wait,” and “well” occurrences are counted in this authored fixture. These are deliberately written as hesitations, not general-purpose classifications of those words.
- First take: 8 fillers; retry: 2 fillers.
- Relative reduction: (8 − 2) / 8 × 100 = 75%. Equal minute-long windows make the displayed per-minute rates 8 and 2.
- Counts, bars, highlighted text, and the percentage derive from `src/lib/landing-sample.ts`. Tests validate their agreement.

## Coaching reference

[Toastmasters: 3 Ways to Make Ah-Counting Count For More](https://www.toastmasters.org/magazine/magazine-issues/2019/feb/sidebars/three-ways-to-make-ah-counting-count-for-more) recommends noticing recurring filler patterns and practicing pauses. It does not substantiate our illustrative 75% reduction, establish a typical retry improvement, or imply that eliminating fillers always improves communication. The UI explicitly separates the coaching guidance from the synthetic numbers.

Normal disfluencies are not a character flaw. Filler count alone is not a measure of overall speaking quality.

## Waveform and goal chart

The compact waveform uses a pale Azure surface and fills automatically at 3× preview speed: 60 illustrative seconds in 20 real seconds, then holds until Replay. It has no seek slider or moving playhead. Pause/resume remains available; offscreen/hidden-tab playback stops, and reduced-motion visitors see a static completed waveform. Deterministic amplitude bars are decorative, not extracted from audio. Authored start times appear beneath the corresponding highlighted transcript words. It does not play or edit audio. Dropdowns and long explanations were removed from the landing preview at the user's request; this document preserves the methodology.

The chart is a four-week **illustrative goal path**, not a forecast or research claim. Five authored sample rates precede eight projected checkpoints, with plateaus and small setbacks. Solid lines distinguish synthetic examples from the dashed goal. These points are separate illustrative practice sessions, not the two takes used in the 75% comparison badge. The landing chart uses the fixed 75% goal, ending at 2 fillers/min; the fixture still supports other goals for testing. Three annotations replace the checkpoint controls. The badge exposes its calculation in its title, and the SVG description states that the path is not a prediction. No practice frequency, success probability, or measured learning curve is asserted.
