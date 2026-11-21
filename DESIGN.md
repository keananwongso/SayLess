# SayLess design system

Use this system across SayLess screens, shared components, and product visuals. The direction is a warm Dune canvas with saturated accents, bold ink typography, rounded cards, and colorful stickers that make practice feel approachable. Draw original SayLess marks from simple speech bubbles, pauses, and sound waves.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `--color-dune` | `#EEE1E0` | Warm page background and neutral fills |
| `--color-surface` | `#FFFFFF` | Navigation, cards, and inputs |
| `--color-ink` | `#190F17` | Headlines, body text, and primary button fill |
| `--color-muted` | `#53424E` | Supporting text on canvas or white |
| `--color-divider` | `#DBCDCE` | Decorative dividers and card borders |
| `--color-control-border` | `#362535` | Input and outlined button boundaries |
| `--color-focus` | `#401454` | Keyboard focus ring |
| `--color-mint` | `#07B682` | Positive changes and challenge completions |
| `--color-lavender` | `#FFB7F1` | Signature phrases and coach feedback |
| `--color-azure` | `#067FF3` | Voice prompt, first-take metrics, and informational highlights |
| `--color-melon` | `#FFA88F` | Secondary Wrapped insights and decorative stickers |
| `--color-jonquil` | `#F7CD1B` | Main Wrapped reveal, sample replay label, and headline emphasis |
| `--color-error-surface` | `#FDE0E3` | Error banners |
| `--color-error-ink` | `#8D213B` | Error text and active recording indicator |

- Use ink text on accent fills and white text on ink buttons. Keep the page mostly canvas and white with one dominant colored card per screen.
- Use the same semantic CSS variables in shared components and Tailwind utilities. Add or change palette values in the shared theme and update this table in the same change.
- Give errors, recording activity, and metric changes text labels. Keep the recording dot decorative when the control already names the state. Use labels and values to distinguish chart series.
- Keep normal text at 4.5:1 contrast or higher. Provide a visible 2px focus ring with a 2px offset and keep control boundaries at 3:1 or higher against adjacent surfaces.

## Type and layout

- Use Geist Sans with a system sans-serif fallback. Use tabular numerals for metrics and timers.
- Use 40–64px for page titles, 24–32px for section titles, 16px for body copy, and 14px for supporting labels. Set the wordmark, top navigation, and page titles in lowercase. Use uppercase with a Jonquil highlight for the emphasized line of the Challenges title. Use sentence case for supporting text.
- Use a 4px spacing grid. Start with 16px mobile gutters, 24px desktop gutters, 16–24px card padding, and a 1120px content cap. Stack cards below 700px and let long transcripts wrap.
- Use 24px card corners, 12px corners on inputs and secondary controls, and pill shapes for primary actions and compact labels. Give interactive controls a minimum 44px hit area and support reduced motion.

## Components and screens

Landing scroll reveals may use up to 650ms with 90ms staggering. Reveal once, keep normal scrolling and keyboard focus, and leave content visible without JavaScript. Transcript charts must include numeric values and selected transcript text, not color alone. Label synthetic comparison metrics and expose their calculation; never present sample improvements as measured customer results.

The public landing page uses a white Surface canvas with an Azure-tinted grid fading into white. Keep Dune for the app and subtle control fills. Use original SVG dot characters with thick Ink expressions, the existing accent tokens, and short 180–400ms entrance/control transitions; disable these for reduced-motion preferences.

Use the shared sticky site navbar on every page. On desktop, use the same handset for Jade’s guided demo and the working app. The handset has a slim rim, camera cutout, and home indicator. On phones, both views use the available width. Let content scroll above the bottom controls and give each screen one prominent next action.

Animate workspace content and the selected tab highlight while keeping the handset and dock in place. Use short entrances, one-time character motion, and direct tap feedback. Respect reduced motion for each effect.

| Pattern | SayLess treatment |
| --- | --- |
| Primary action | Ink pill with white text. Give the main action one clear verb and one prominent placement. |
| Secondary action | White or transparent fill, ink label, and control border. Use for hearing audio, importing a file, and opening a sample. |
| Analyze | Start with one recording picker. Show the analysis action after a file is selected, then display the report beneath it. |
| Wrapped | Lead with a single Ink card and large Lavender type for the most repeated word. Show its source and count. Use neutral rows for secondary stats and disclosures for detailed insights. |
| Demo Yap Recap | Highlight the top expression in large Ink type on Lavender. Label the conversation as simulated and show the estimated counts in compact rows with bars. |
| Demo two-week goal | Pair the recap baseline and two-week target. Use a flat reference line for the baseline and a dashed Mint line for the practice targets. |
| Home | Lead with weekly check-ins, then show XP, the daily quest, and a Friends preview. |
| Stats | Show practice takes when available. Use Lavender for Jade’s demo recap and Mint for her example targets. Label the demo data and keep it apart from personal takes. |
| Friends | Use a compact list with dot avatars, names, and practice streaks. Label synthetic friends and keep quest sharing in a separate card. |
| Practice | Put the prompt on a pale Azure fill inside a single card. Keep recording as the primary action. Show the timer, processing state, or error beside the control and keep sample replay reachable. |
| Profile | Use a dot avatar, compact stats, and a seven-day completion strip. Show practice totals for the current session and challenge progress saved in the browser. |
| Results | Use the same metric order and units on both takes. Use Azure for the baseline highlight, Mint for a positive change, and Lavender for the coaching suggestion. Use Jonquil for the sample replay label. |
| Stickers | Use original, simple shapes with thick ink marks. Place them beside an insight or on an empty state where they leave the primary action and data legible. |

Write coaching copy that is specific, encouraging, and grounded in the take. Use playful language for Wrapped when it fits the data.
