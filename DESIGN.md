# SayLess design system

Use this system across SayLess screens, shared components, and product visuals. The direction is a light lavender canvas, bold ink typography, rounded cards, and colorful stickers that make practice feel approachable. Draw original SayLess marks from simple speech bubbles, pauses, and sound waves.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `--color-canvas` | `#F4F1FA` | Page background |
| `--color-surface` | `#FFFFFF` | Navigation, cards, and inputs |
| `--color-ink` | `#201B2C` | Headlines, body text, and primary button fill |
| `--color-muted` | `#5E566C` | Supporting text on canvas or white |
| `--color-divider` | `#DDD5E7` | Decorative dividers and card borders |
| `--color-control-border` | `#756889` | Input and outlined button boundaries |
| `--color-focus` | `#5A3496` | Keyboard focus ring |
| `--color-lime` | `#CBF58C` | Main Wrapped reveal and positive changes |
| `--color-lilac` | `#DEC5FF` | Signature phrases and coach feedback |
| `--color-sky` | `#BBDDFC` | Voice prompt, first-take metrics, and informational highlights |
| `--color-peach` | `#FFBD99` | Secondary Wrapped insights and decorative stickers |
| `--color-butter` | `#FFE28A` | Sample replay label and decorative stickers |
| `--color-error-surface` | `#FDE0E3` | Error banners |
| `--color-error-ink` | `#8D213B` | Error text and active recording indicator |

- Use ink text on accent fills and white text on ink buttons. Keep the page mostly canvas and white with one dominant colored card per screen.
- Use the same semantic CSS variables in shared components and Tailwind utilities. Add or change palette values in the shared theme and update this table in the same change.
- Give errors, recording activity, and metric changes text labels. Keep the recording dot decorative when the control already names the state. Use labels and values to distinguish chart series.
- Keep normal text at 4.5:1 contrast or higher. Provide a visible 2px focus ring with a 2px offset and keep control boundaries at 3:1 or higher against adjacent surfaces.

## Type and layout

- Use Geist Sans with a system sans-serif fallback. Use tabular numerals for metrics and timers.
- Use 40–64px for page titles, 24–32px for section titles, 16px for body copy, and 14px for supporting labels. Use bold headings, sentence case, and short metric labels.
- Use a 4px spacing grid. Start with 16px mobile gutters, 24px desktop gutters, 16–24px card padding, and a 1120px content cap. Stack cards below 700px and let long transcripts wrap.
- Use 24px card corners, 12px corners on inputs and secondary controls, and pill shapes for primary actions and compact labels. Give interactive controls a minimum 44px hit area and support reduced motion.

## Components and screens

| Pattern | SayLess treatment |
| --- | --- |
| Primary action | Ink pill with white text. Give the main action one clear verb and one prominent placement. |
| Secondary action | White or transparent fill, ink label, and control border. Use for hearing audio, importing a file, and opening a sample. |
| Wrapped | Lead with one lime card for the most repeated word. Use lilac for a signature phrase and peach for a secondary insight. Show the source and counts next to the insight. |
| Practice | Use a sky card for the prompt with a prominent recording control. Show the timer, processing state, or error beside the control and keep sample replay reachable. |
| Results | Use the same metric order and units on both takes. Use sky for the baseline highlight, lime for a positive change, and lilac for the coaching suggestion. Use butter for the sample replay label. |
| Stickers | Use original, simple shapes with thick ink marks. Place them beside an insight or on an empty state where they leave the primary action and data legible. |

Write coaching copy that is specific, encouraging, and grounded in the take. Use playful language for Wrapped when it fits the data.
