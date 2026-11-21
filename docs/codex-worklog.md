# Codex work log

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

See the [voice analysis architecture](voice-analysis.md), [practice API and tracing guide](voice-api.md), and [demo rehearsal notes](demo-rehearsal.md).

## Guided demo

`feat/guided-demo` adds `/demo` with sample onboarding, analyzed chat insights, original voice clips, a retry comparison, and simulated Challenges rewards. It reuses Wrapped analysis, voice replay, and challenge scoring. See the [guided rehearsal steps](demo-rehearsal.md#guided-40-second-walkthrough).

`design/demo-onboarding` separates setup, Wrapped, practice, comparison, and the challenge finish into five focused screens. Each uses one brand color as an accent. Chat statistics and full transcripts are available through disclosures.

`design/jade-demo` turns the guided walkthrough into Jade’s story. The demo uses her chat findings and prerecorded pitch takes, with one starting action.

## Product routes

The landing, Jade’s demo, working app, and architecture now have separate routes. The Analyze tab accepts a consented recording and shows whole-recording filler counts, repeated language, transcript, and playable timestamps. It uses the existing Deepgram pipeline in analysis mode.
