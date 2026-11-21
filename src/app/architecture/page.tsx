import type { Metadata } from "next";
import Link from "next/link";
import { sampleProfiles } from "@/lib/sample-pitches";
import styles from "./architecture.module.css";

export const metadata: Metadata = {
  title: "SayLess | Architecture",
  description: "Follow a recording through transcription, timestamped speech analysis, and the coaching loop.",
};

const pipeline = [
  { title: "Capture", text: "Record a pitch in the browser or upload an audio file." },
  { title: "Transcribe", text: "Deepgram returns words with start and end times." },
  { title: "Measure", text: "SayLess code normalizes and counts fillers, then links each one to its audio." },
  { title: "Coach", text: "The most frequent repeated filler becomes the focus for the next take." },
];

const [take] = sampleProfiles[0].takes;
const payload = JSON.stringify({ transcript: take.transcript, events: take.events }, null, 2);

export default function ArchitecturePage() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="wordmark"><span className="brand-mark" aria-hidden="true" />SayLess</Link>
          <nav aria-label="Main navigation">
            <Link href="/demo">Demo</Link>
            <Link href="/app">Use SayLess</Link>
          </nav>
        </div>
      </header>
      <main className={`shell flow ${styles.page}`}>
        <section className={styles.hero} aria-labelledby="architecture-title">
          <p className="eyebrow">Architecture</p>
          <h1 id="architecture-title">every count has a clip.</h1>
          <p>SayLess connects what you see in your results to the moment it happened in the recording.</p>
        </section>

        <section aria-labelledby="pipeline-title" className={styles.section}>
          <h2 id="pipeline-title">from recording to feedback</h2>
          <ol className={styles.pipeline}>
            {pipeline.map(({ title, text }) => (
              <li key={title}><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
          <div className={styles.loop}>
            <span aria-hidden="true">↻</span>
            <div>
              <h3>The next take closes the loop</h3>
              <p>SayLess carries the speaker’s current focus into the comparison. The new take shows what changed and can shift what the coach highlights next.</p>
              <p className={styles.loopPath}>Compare takes → update the focus → analyze the next take</p>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="payload-title">
          <h2 id="payload-title">inspect an example</h2>
          <p>Each event holds a word and its location in the original audio, in milliseconds.</p>
          <details className={styles.payload}>
            <summary>View the sample API response</summary>
            <pre><code>{payload}</code></pre>
          </details>
          <p className={styles.note}>Runtime logs track request IDs, timings, errors, and event counts.</p>
        </section>

        <div className="action-row">
          <Link className="primary" href="/app">Analyze a recording</Link>
          <Link className="secondary" href="/demo">Watch Jade’s demo</Link>
        </div>
      </main>
    </>
  );
}
