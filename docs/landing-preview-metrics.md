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

## Waveform and goal chart

The waveform references the supplied outlined-region visual, using SayLess colors rather than tone or emotion classifications. Its deterministic amplitude bars are decorative, not extracted from audio. Authored start/end times match each segment's filler order. First/retry, seeking, and pause preview all retain a 60-second axis. Playback is silent and user-initiated; reduced-motion visitors use the seek slider and timestamp buttons.

The Duolingo-inspired progress chart is an adjustable four-week **goal**, not a forecast or research claim. Starting at 8 fillers/min, the selected 25%, 50%, or 75% reduction yields end targets of 6, 4, or 2. Weekly milestones are linear interpolation, not an estimated learning curve. Numeric values remain available in a disclosure. No practice frequency or success probability is asserted.
