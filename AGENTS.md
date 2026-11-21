<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## SayLess team workflow

- Branch from the latest `origin/main` for each task. Keep changes in small commits and push your task branch for review.
- Agree on the files each teammate will edit before working in parallel. Coordinate changes to `package.json`, the lockfile, the page flow, and global styles in the team chat because multiple tasks can touch them.
- If a task depends on another branch or changes the practice API, flag that in the team chat and include it in your handoff.
- Run `npm run lint`, `npm run typecheck`, and `npm run build` before merging. If you change the demo flow, also run Wrapped → Practice → Results and check **Watch sample replay**.
- In your handoff, include the branch, what works, what you verified, and anything the next teammate needs to pick up.

## Demo and code map

- The two-minute demo shows Communication Wrapped, one project-pitch prompt, and feedback comparing two takes. See the [rehearsal steps](docs/demo-rehearsal.md).
- `src/app/page.tsx` connects the screens. `src/components/` contains the Wrapped, Practice, and Results views. `src/lib/` holds CSV parsing, metrics, and sample data.
- `POST /api/practice` accepts recorded audio in the multipart `audio` field and returns `{ transcript, suggestion }` on success or `{ error }` on failure. Keep the offline sample replay usable when the live route fails.
- Use synthetic data in the repo. Keep imported chats in the browser and put `OPENAI_API_KEY` in a local environment file or Vercel's server-side settings.

## Local development

Run `npm ci` and `npm run dev`, then open http://localhost:3000. Set `OPENAI_API_KEY` in your shell or `.env.local` for live coaching. Add the same variable to the Production environment in Vercel for the hosted app.

See the [original hackathon kickoff template](docs/hackathon-kickoff-prompt.md) for team planning. It contains placeholders for roles, branch ownership, and the schedule.
