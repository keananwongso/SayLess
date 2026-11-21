# Codex work log

## Minimal landing labels — November 21, 2026

- Branch `codex/landing-minimal-copy` starts from `origin/main` (`b0c482f`) and carries forward the unmerged visual-first landing work.
- Removed the four requested Discover/Practice labels and the unused sample-footer spacing. Kept chart behavior, sample-qualified metrics, and illustrative goal labeling unchanged. No app/demo/API changes.
- Verified lint, typecheck, seven fixture tests, production build, HTTP/CSS checks, and all three preview tabs in isolated Chrome at 1440, 390, and 320px: removed labels absent, no horizontal overflow. No merge or deployment.

## Visual-first landing preview — November 21, 2026

- Branch `codex/landing-visual-first` starts at latest `origin/main` (`b0c482f`) and carries forward the unmerged landing changes. No app/demo/API changes.
- Applied the Fermata browser review: one navigation row, no duplicate preview heading, no dropdowns or explanation blocks, and one short illustrative label. Practice shows inline timestamped words beneath the progressively filled waveform with one pause/resume/replay control. Plays once and holds; reduced motion is static. Compare replaces the large stat card with an inline badge, annotations, and a 550ms graph reveal with a clearly distinguished illustrative goal.
- Responsive chart variants avoid horizontal scrolling. Retains SayLess palette, dot artwork, readable text and 44px controls. Sites presentation guidance informed the simpler hierarchy; source/method notes remain in `docs/landing-preview-metrics.md` rather than marketing copy.
- Isolated Chrome (Puppeteer, explicitly authorized by user) checked 1440, 390, and 320px widths: no horizontal overflow or dropdowns. Captured and inspected Practice/Compare screenshots; tested autoplay advancement, pause/resume, finished hold/replay, reduced-motion static output, and no browser errors. Practice at 390px is about 490px tall versus the previous ~767px. Lint, typecheck, seven tests, production build, and HTTP/CSS/routes checks pass; final punctuation adjustment rechecked before handoff.
- No merge or deployment. Local preview stays on port 3000.

## Landing-sized previews — November 21, 2026

- `codex/landing-compact-preview` starts from `origin/main` (`b0c482f`) and carries forward the unmerged landing graph work; unrelated app/demo/pitch changes remain intact.
- Capped the outer preview at 960px, removed duplicate Practice/Compare headings, large minimum heights, and the nested Practice card frame. Practice now caps at 600px with a 48px waveform and tighter spacing, preserving 16px body text and 44px controls.
- Compare now places a compact 75%/before-after summary beside the 210px-high chart. Goal controls and all 13 checkpoints remain available under a disclosure. Mobile stacks naturally without clipping content or scaling text down. Sites guidance informed the reduction in visible controls and repeated copy.
- Autoplay, reduced-motion support, fixture math, and projections remain unchanged. Lint, typecheck, seven fixture/layout source tests, production build, and whitespace checks pass. Browser visual verification is pending; no merge/deployment.

## Edge-to-edge pitch on load — November 21, 2026

On `codex/pitch-edge-to-edge`, made the deck fill the browser viewport from the first slide and removed the presentation toolbar. Lint, typecheck, and build passed. Chrome verified the layout on load and forward and backward keyboard navigation at desktop and mobile viewport sizes.
## Compact autoplay landing graphs — November 21, 2026

- `codex/landing-autoplay-polish` starts at `origin/main` (`dd17765`) and carries forward the unmerged graph work. Main's pitch route and shared navigation are preserved; API and guided demo unchanged.
- Practice now uses a centered 720px maximum card, pale Azure surface, progressively filled waveform, varied authored hesitation words, and timestamp disclosure. Removed the slider/playhead. Silent 3× autoplay holds then loops, with pause/resume, offscreen/hidden-tab suspension, timer cleanup, and reduced-motion static mode.
- Compare has 13 selectable checkpoints with plateaus and setbacks, solid synthetic examples, and dashed illustrative projections. Data labels and disclaimers follow Sites guidance; no measured performance or prediction claims.
- Lint, typecheck, six fixture/source tests, production build, and whitespace checks pass. Browser-tab access is unavailable, so visual/interaction QA remains pending. No merge or deployment.

## Fullscreen pitch deck — November 21, 2026

On `codex/pitch-fullscreen`, expanded the active slide to the screen edges in fullscreen, hid the toolbar while presenting, and removed speaker notes. The deck fills the browser viewport when native fullscreen is blocked. Lint, typecheck, and build passed. Chrome verified native fullscreen, hidden controls, keyboard navigation through all six slides, and exiting native and viewport fullscreen.

## Demo Yap Recap and responsive layout — November 21, 2026

Replaced the imitation phone hardware with a content-sized desktop surface. On phones, the app and demo stay edge to edge with controls below scrolling content. Renamed Jade’s demo reveal to Yap Recap and gave the source-backed word count a distinct Ink and Lavender treatment. Simplified the finish screen around one primary action.

Lint, typecheck, build, and served landing checks passed. Chrome verified all five demo steps and sample replay at 320px, 390px, and 1440px. Opened the recap details and inspected desktop captures of the reveal and finish.

## Phone interface and local profile — November 21, 2026

On `codex/phone-interface`, added a desktop phone frame and full-width mobile screens for the app and Jade’s demo. App tabs and demo actions stay reachable below scrolling content. Practice retains access to the last live results.

Profile adds an editable display name, saved challenge XP and streak, a seven-day completion strip, and current-session practice stats. It shares the existing browser challenge store.

Lint, typecheck, build, and served landing checks passed. Chrome verified scroll and tab behavior at 320px, 390px, and 1440px, profile progress and name persistence, sample replay, and the five-step demo.

## Pitch deck URL — November 21, 2026

On `codex/pitch-route`, added a Next.js rewrite so `/pitch` serves Allison’s existing deck and keeps the short URL in the address bar. Lint, typecheck, and production build passed. The production server returned HTTP 200 and identical HTML from `/pitch` and `/pitch.html`.
## Timestamped waveform and practice goals — November 21, 2026

- Branch `codex/landing-waveform-goals` starts at latest `origin/main` (`9b9a440`) and carries forward the transcript feature, preserving main's shared header and phone-first demo changes. No API or demo-flow changes.
- Replaced segment bars with an original SVG waveform, highlighted um/uh regions, exact authored timestamp controls, silent user-initiated playhead, seek slider, first/retry switch, and same-duration proposed-pause preview. Mobile waveform scrolls without compressing labels; motion preferences disable playback animation.
- Added Duolingo-inspired goal chart with 25/50/75% target controls, baseline, weekly milestones, accessible numeric disclosure, and explicit non-predictive labeling. Sites guidance informed the separation of illustrative goals from evidence; no new hosting or dependencies.
- Lint, typecheck, production build, and served HTML/CSS/navigation checks pass; five fixture tests cover counts, timing/token alignment, and goal math. Isolated browser unavailable, so visual and interactive browser QA remains unverified. No merge or deployment.

## Shared navigation and phone-first demo — November 21, 2026

On `codex/shared-site-navigation`, moved the landing navbar into the root layout and kept workspace tabs inside the app. Capped the workspace and Jade’s demo at 600px. Analyze starts with a recording picker, Wrapped leads with one insight, and Practice prioritizes recording. Challenges and results stack in a single column. Shortened the landing preview label to “Sample.”

Lint, typecheck, production build, and the served landing check passed. Chrome checked all four pages and workspace tabs at 320px, 390px, and 1440px. Also checked a recording upload and filler clip, CSV import, private snapshot, sample replay, and all five demo screens through the link into live Practice.

## Steady landing navigation — November 21, 2026

On `codex/steady-landing-nav`, pinned the landing navbar at its original desktop and mobile insets and removed the "Use SayLess" hover lift. In-page targets clear the bar. Lint, typecheck, build, and the served landing check passed. Chrome verified the bar and button positions at 320px and 1440px and confirmed the preview anchor stays visible.
## Transcript preview and scroll motion — November 21, 2026

- Branch `codex/landing-transcript-motion`, based on latest main (`9c89c9c`). Landing-only changes; the app, guided demo, audio assets, and practice API are unchanged.
- Replaced landing audio players with a selectable six-segment transcript graph, first/retry controls, highlighted fillers, and a comparison chart. Authored equal 60-second synthetic fixtures with 8 and 2 whole-word um/uh occurrences; the displayed 75% reduction is derived, explicitly illustrative, and never presented as a customer average or research finding. Source and caveats: [metric notes](landing-preview-metrics.md).
- Added once-per-section intersection-based reveals, staggered dots/cards, animated comparison bars, and panel transitions. Keeps standard scrolling and focus, preserves dot rotations, cancels motion when reduced motion is enabled, and leaves content visible without JS.
- Sites presentation guidance informed concise copy, concrete examples, and separation of sample claims from evidence. No new hosting or dependencies.
- Verified: three fixture tests, lint, typecheck, production build, diff whitespace check, and final HTTP/CSS regression including highlight markup, no landing audio, all product routes, and legacy redirect. Browser visual/mobile/interaction QA is unverified because isolated IAB is unavailable. Local final-build preview at port 3000; no deployment or merge performed.

## Landing polish merge — November 21, 2026

Merged `codex/landing-dots-polish` into `main`. Kept the grid, SVG dots, and interactive preview alongside the links to the working app, Jade’s demo, and the architecture page. The practice button opens `/app#practice`.

Lint, typecheck, production build, and the served landing regression check passed. Chrome showed no horizontal overflow at 320px and 1440px. Verified the preview buttons and navigation into the Practice tab.

## Dot-led landing refinement — November 21, 2026

- Branch `codex/landing-dots-polish` starts from latest main and integrates the prior landing work. Adapted the supplied Fermata reference's floating navigation, fading grid backdrop, framed product view, and segmented navigation in SayLess's own components and palette.
- Replaced the pink page canvas with Surface white and a pale Azure/Lavender grid. Added a reusable original SVG `SayLessDot` with pause, curious, bright, and calm expressions. Removed the oversized raster illustration from the page and reduced repeated marketing text. Updated DESIGN.md with the landing-specific canvas and motion rules; app colors are unchanged.
- Preview controls remain functional with existing synthetic audio/data. Added short panel/hero entrance and button transitions, all disabled for reduced-motion. No new dependencies or API changes.
- Lint, typecheck, build and final served-CSS regression checks pass, including SVG markup, responsive rules, reduced-motion fallback, and destination routes. Browser visual verification remains blocked: browser inventory access was denied and isolated IAB is unavailable; do not infer visual verification from these checks.

## Clean landing redesign — November 21, 2026

- Branch: `codex/landing-clean-redesign`, based on `origin/main` at `dfc2b29`, carrying forward the landing-route/CSS-loader repair. Preserved the newer Jade guided demo and hash-aware full app; its final CTA now opens `/practice#practice`.
- Took layout inspiration from the supplied Fermata reference: compact floating navigation, centered hero, generous spacing, and a component-based product preview. Kept DESIGN.md palette/type, restrained original dot marks, and a smaller existing illustration. Sites presentation guidance informed the concrete product walkthrough and explicit sample labeling; no new hosted Site or services.
- Added `LandingPreview` with accessible pressed-state screen buttons for Discover, Practice, and Compare. Counts, transcripts, suggestions, and audio come from the existing synthetic Alex fixture; no invented customer claims. Uses native audio controls and responsive layouts.
- Verification: lint, typecheck, production build, and HTTP regression checks pass against the final restarted server, including stylesheet class mappings and `/demo` and `/practice` destinations. Stopped the old production server before rebuilding to prevent stale CSS asset references. Browser visual and interaction checks remain pending browser access; do not treat the HTTP check as a visual test.

## Landing styling repair — November 21, 2026

- Branch: `codex/fix-landing-styles`, based on latest `origin/main` (`a6d3d67`). Brings forward the landing page and illustration from `codex/landing-demo-dots` without replacing the newer guided demo.
- Restricted the Tailwind loader to `globals.css`: the previous `*.css` rule with `as: "*.css"` broke CSS Module scoping. Landing layout now keeps its scoped styles, bounded illustration, responsive grid, title, and Demo navigation using DESIGN.md tokens.
- Routes: `/` landing, `/demo` guided walkthrough, `/practice` existing full app. Updated the guided demo's Open app link; practice API unchanged.
- Added `node scripts/check-landing.mjs [base-url]` to check actual served CSS class mappings, responsive rules, artwork, and destination routes. Lint, typecheck, build, and production HTTP checks pass.
- Browser visual/mobile and interactive replay checks remain unverified: native Chrome access was blocked to avoid exposing unrelated private tabs, and isolated Chrome is unavailable. No claim of visual verification.

Use this file to share what Codex helped build, what the team verified, and what another teammate needs to pick up. Add a short entry when a task ships, an experiment changes the approach, or a branch needs a handoff. Put longer analysis in a linked file under `docs/`.

Each entry should include the date and branch or commit, the change or decision, the verification, and any open work. Use synthetic examples in the repo.

## November 21, 2026

| Work | Result | Verification |
| --- | --- | --- |
| MVP and deployment | Built Communication Wrapped, CSV import, mic capture, transcription, coaching, two-take comparison, and sample replay. Deployed to Vercel. | Verified two synthetic voice takes through Chrome, plus silence handling, API failure, and offline replay. |
| Shared design and UI | Defined the palette in `DESIGN.md`, restyled the three app screens, and replaced the native speaker picker with a styled control. | Checked the flow on desktop and mobile, including keyboard selection, focus, Escape, and CSV import. |
| Product and demo scope | Proposed a 40-second walkthrough inside the pitch. Show one Wrapped insight, record a short retry against a rehearsed first take, and compare the results. Switch to the labeled sample replay if the live take is still processing at 30 seconds. | The existing flow works in Chrome. The full 40-second presentation still needs a timed rehearsal with the presenter. |
| Voice analysis | Opened `feat/voice-analysis` from `0b1fd9c` and scoped a replayable timeline built from timestamped fillers and audio-derived pauses. | The current app calculates counts and pace from transcript text and recording duration. Timestamp accuracy and pause detection still need fixture tests. |
| Phase 4 product pillars | Implemented 4.1 with text-only habit detection, a data-grounded communication profile, and local count-only snapshots. Added a clearly labeled 4.2 multi-turn simulator preview while keeping the working one-pitch coach. Implemented local-first 4.3 challenges: daily XP/streaks, a session Filler Jar, copyable accountability prompts/achievements, and a transparent demo duel. | `npm run lint`, `npm run typecheck`, and `npm run build` pass on `codex/phase-4-1-4-3`. The live `POST /api/practice` contract is unchanged. |
| Voice learning loop | Added the proposed feedback loop to the architecture diagram on `feat/voice-analysis`. The current take updates the speaker’s learned rule, and SayLess applies that rule when comparing the next take. | Diagram updated. Automatic rule selection and retry comparison still need implementation. |
| Voice analysis implementation | Added the Deepgram adapter, automatic rule updates, playable filler clips, two synthetic speakers, and request tracing. | Verified rule transitions and offline clip playback in Chrome with mocked Deepgram responses. The OpenAI transcript-only path processed a synthetic take in about 3.7 seconds locally. Real Deepgram accuracy and latency need a configured key. |
| Phase 4 and voice integration | Connected Challenges to count-only take summaries and kept the latest audio pair in Practice for replay. | All four synthetic clips returned the expected filler counts from live Deepgram. Marker starts differed by at most 198 ms from the fixture markers. Local API responses took 1.7–2.5 seconds. |
| Palette and typography | Applied the six reference colors across SayLess, set display titles in lowercase, and emphasized “REAL MOMENTUM.” with a Jonquil highlight. | Checked palette contrast and exercised Wrapped, Challenges, and sample replay in Chrome at desktop and mobile widths. |
| HTML pitch · `presentation` | Added a six-slide [browser deck](../public/pitch.html) with speaker notes, sourced statistics, a chat screenshot gallery, and a demo title card. | Checked desktop and mobile layout and keyboard navigation in Chrome. |

See the [voice analysis architecture](voice-analysis.md), [practice API and tracing guide](voice-api.md), and [demo rehearsal notes](demo-rehearsal.md).

## Guided demo

`feat/guided-demo` adds `/demo` with sample onboarding, analyzed chat insights, original voice clips, a retry comparison, and simulated Challenges rewards. It reuses Wrapped analysis, voice replay, and challenge scoring. See the [guided rehearsal steps](demo-rehearsal.md#guided-40-second-walkthrough).

`design/demo-onboarding` separates setup, Wrapped, practice, comparison, and the challenge finish into five focused screens. Each uses one brand color as an accent. Chat statistics and full transcripts are available through disclosures.

`design/jade-demo` turns the guided walkthrough into Jade’s story. The demo uses her chat findings and prerecorded pitch takes, with one starting action.

## Product routes

The landing, Jade’s demo, working app, and architecture now have separate routes. The Analyze tab accepts a consented recording and shows whole-recording filler counts, repeated language, transcript, and playable timestamps. It uses the existing Deepgram pipeline in analysis mode.
