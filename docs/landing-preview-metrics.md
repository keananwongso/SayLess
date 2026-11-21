# Landing preview metrics

The landing preview is a synthetic, authored example. It does not use customer recordings, scientific study measurements, or the app's live analysis route.

- Two illustrative 60-second takes are split into six authored 10-second segments. These are not timestamped audio measurements.
- Only whole-word “um” and “uh” occurrences are counted, case-insensitively.
- First take: 8 fillers; retry: 2 fillers.
- Relative reduction: (8 − 2) / 8 × 100 = 75%. Equal minute-long windows make the displayed per-minute rates 8 and 2.
- Counts, bars, highlighted text, and the percentage derive from `src/lib/landing-sample.ts`. Tests validate their agreement.

## Coaching reference

[Toastmasters: 3 Ways to Make Ah-Counting Count For More](https://www.toastmasters.org/magazine/magazine-issues/2019/feb/sidebars/three-ways-to-make-ah-counting-count-for-more) recommends noticing recurring filler patterns and practicing pauses. It does not substantiate our illustrative 75% reduction, establish a typical retry improvement, or imply that eliminating fillers always improves communication. The UI explicitly separates the coaching guidance from the synthetic numbers.

Normal disfluencies are not a character flaw. Filler count alone is not a measure of overall speaking quality.
