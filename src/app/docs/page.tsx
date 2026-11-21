import type { Metadata } from "next";
import Link from "next/link";
import { dailyChallenge } from "@/lib/challenges";
import { jadeConversationDuration, jadeGoal, jadeTopExpression } from "@/lib/jade-demo";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "SayLess | Docs",
  description: "Practice a pitch, read your Stats, share the daily quest, and see where your data goes.",
};

const [baseline, weekOne, weekTwo] = jadeGoal;

export default function DocsPage() {
  return (
    <main id="main" className={`shell flow ${styles.page}`}>
      <div className={styles.intro}>
        <h1>sayless docs.</h1>
        <p>Practice a pitch, find your speaking habits, or follow Jade’s guided demo.</p>
        <div className="action-row">
          <Link className="primary" href="/app">Open the app</Link>
          <Link className="secondary" href="/demo">Try the demo</Link>
        </div>
      </div>

      <section className={styles.section} aria-labelledby="using-sayless">
        <h2 id="using-sayless">using sayless</h2>
        <div className={styles.features}>
          <section>
            <h3>Home</h3>
            <p>Tap <strong>Roll daily quest</strong> on Home to reveal a prompt and try the recording preview. Open <strong>Practice your pitch</strong> from Profile for live coaching and a two-take comparison. Select <strong>Watch sample replay</strong> in Practice to hear a prerecorded comparison.</p>
            <p>Finish in 20 seconds or less with at most two filler sounds, then return to Home to claim {dailyChallenge.xp} XP for the day.</p>
          </section>
          <section>
            <h3>Stats</h3>
            <p><strong>Your recent practice</strong> shows filler counts for takes recorded in the current session. Jade’s Yap Recap and two-week goal use her demo conversation.</p>
            <p><strong>Analyze a recording</strong> accepts M4A, MP3, WAV, WebM, or Ogg files up to 4 MB. See fillers and repeated phrases across the recording, and replay filler clips when timestamps are available.</p>
            <p><strong>Open Wrapped</strong> shows writing patterns by speaker. Start with the sample chat or import a CSV up to 1 MB with <code>speaker</code> and <code>message</code> columns. Save a count-only snapshot to compare later.</p>
          </section>
          <section>
            <h3>Friends</h3>
            <p>See sample activity from Jade and Riley. Use <strong>Copy quest prompt</strong> to share today’s clear-pitch challenge.</p>
          </section>
          <section>
            <h3>Profile</h3>
            <p>Edit your display name and see your saved check-ins, streak, and XP. Practice totals cover the current session.</p>
          </section>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="demo-data">
        <h2 id="demo-data">what the demo simulates</h2>
        <ol className={styles.steps}>
          <li><strong>Simulate upload</strong> runs in your browser with Jade’s sample. It requires no file or microphone.</li>
          <li><strong>Yap Recap</strong> shows an estimated {jadeTopExpression.count} uses of “{jadeTopExpression.expression}” across all speakers in the {jadeConversationDuration} sample conversation.</li>
          <li><strong>Two-week goal</strong> compares the baseline of about {baseline.count} with example targets of {weekOne.count} in week one and {weekTwo.count} in week two for comparable conversations. Select <strong>Use SayLess</strong> to continue to Home.</li>
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="data-handling">
        <h2 id="data-handling">where your data goes</h2>
        <p>SayLess analyzes imported chats in the browser. Your display name, challenge progress, and any count snapshots you save stay in this browser.</p>
        <p>Recorded or uploaded audio goes to the configured transcription provider. When live coaching is enabled, OpenAI receives the transcript and coaching focus. Refreshing the app clears the current audio, reports, and takes.</p>
      </section>

      <section className={styles.section} aria-labelledby="still-to-build">
        <h2 id="still-to-build">still to build</h2>
        <ul className={styles.gaps}>
          <li>Real-time, two-way voice practice for interviews, networking, and difficult conversations.</li>
          <li>Rotating daily topics and longer guided speaking sessions.</li>
          <li>Accounts, cross-device history, and challenges shared with real friends.</li>
          <li>Speaker-by-speaker breakdowns for uploaded recordings.</li>
        </ul>
      </section>
    </main>
  );
}
