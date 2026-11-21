import type { Metadata } from "next";
import Link from "next/link";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "SayLess | Docs",
  description: "Learn how to use SayLess, what the demo simulates, and what’s still to build.",
};

export default function DocsPage() {
  return (
    <main id="main" className={`shell flow ${styles.page}`}>
      <div className={styles.intro}>
        <h1>sayless docs.</h1>
        <p>Use your own recording, practice a pitch, or follow Jade’s guided demo.</p>
        <div className="action-row">
          <Link className="primary" href="/app">Open the app</Link>
          <Link className="secondary" href="/demo">Try the demo</Link>
        </div>
      </div>

      <section className={styles.section} aria-labelledby="using-sayless">
        <h2 id="using-sayless">using sayless</h2>
        <dl className={styles.features}>
          <div>
            <dt>Analyze · Stats</dt>
            <dd>Upload an M4A, MP3, WAV, WebM, or Ogg recording up to 4 MB. The report counts fillers and repeated phrases across the full recording. When timestamps are available, play the moment a filler occurred.</dd>
          </div>
          <div>
            <dt>Wrapped · Stats</dt>
            <dd>Explore the sample chat or import a CSV up to 1 MB with <code>speaker</code> and <code>message</code> columns. Pick a speaker to see their writing patterns and save a count-only snapshot for later comparison.</dd>
          </div>
          <div>
            <dt>Practice · Home</dt>
            <dd>Record a short project pitch, get a coaching cue, then try the same prompt again. Compare your two takes or open <strong>Watch sample replay</strong> to try the comparison with prerecorded audio.</dd>
          </div>
          <div>
            <dt>Home and Profile</dt>
            <dd>Complete the daily clear-pitch quest, claim XP, and see your streak and recent activity. Profile shows saved quest progress and practice totals for the current tab.</dd>
          </div>
          <div>
            <dt>Friends</dt>
            <dd>Copy today’s quest prompt to share it. Jade and Riley’s sample check-in shows how friends can compare a week of progress against their own starting counts.</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="demo-data">
        <h2 id="demo-data">what the demo simulates</h2>
        <p>The three-screen onboarding demo simulates uploading Jade’s sample conversation in the browser. Yap Recap shows estimated counts across all speakers in that 2:23 conversation. The two-week graph shows example targets for comparable conversations. Select <strong>Use SayLess</strong> to continue to Home.</p>
      </section>

      <section className={styles.section} aria-labelledby="data-handling">
        <h2 id="data-handling">where your data goes</h2>
        <p>SayLess analyzes imported chats in the browser. Your display name, challenge progress, and any count snapshots you save stay in this browser.</p>
        <p>Recorded or uploaded audio goes to the configured transcription provider. When live coaching is enabled, OpenAI receives the transcript and coaching focus. Refreshing the app clears the current audio, reports, and takes.</p>
        <Link className={styles.link} href="/architecture">See how transcription and coaching work</Link>
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
