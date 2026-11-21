# SayLess

Say less. Mean more.

SayLess helps you discover your communication habits, practice a project pitch, and compare two takes.

Run `npm ci` and `npm run dev`, then open http://localhost:3000.

## Live practice

Set `OPENAI_API_KEY` in the shell or in `.env.local` for local development. For Vercel, add it to the project's Production environment variables. The server sends recorded audio and its transcript to OpenAI to generate feedback. The browser keeps both takes in memory until the tab is refreshed.

Wrapped analyzes the built-in synthetic chat by default. To import consented data, provide a CSV with `speaker` and `message` columns. Imported chats stay in the browser.

## Two-minute demo

- **Before the pitch** — In Chrome, open Practice, allow mic access, and save a first take with a couple of natural fillers. Return to Wrapped in the same tab.
- **0:00–0:40** — Give the workplace communication opener and introduce SayLess.
- **0:40–0:55** — Show the sample Wrapped. Alex said “wait” seven times across eight messages.
- **0:55–1:30** — Open pitch practice, hear the prompt, and record a roughly ten-second retry. Lead with SayLess and who it helps.
- **1:30–1:50** — Show the two takes and one coaching suggestion. If the mic or live coaching stalls, open **Watch sample replay** to show the synthetic comparison.
- **1:50–2:00** — Close with “Say less. Mean more.”

Run `npm run lint`, `npm run typecheck`, and `npm run build` before deploying.

## Team kickoff

Start with the [shared agent instructions](AGENTS.md). Claude Code loads them through `CLAUDE.md`.

The [hackathon kickoff prompt](docs/hackathon-kickoff-prompt.md) is the original template. It still contains placeholders for team roles, branch ownership, and the schedule.
