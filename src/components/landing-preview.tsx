"use client";

import { useState } from "react";
import Link from "next/link";
import { SayLessDot } from "./sayless-dot";
import { landingSample, firstCounts, retryCounts, firstTotal, retryTotal, reductionPercent } from "@/lib/landing-sample";
import styles from "@/app/landing.module.css";

const screens = ["Discover", "Practice", "Compare"] as const;

function HighlightedTranscript({ text }: { text: string }) {
  return <>{text.split(/(\b(?:um|uh)\b)/gi).map((part, index) =>
    /^(um|uh)$/i.test(part) ? <mark key={index}>{part}</mark> : part)}</>;
}

function TranscriptGraph() {
  const [take, setTake] = useState<"first" | "retry">("first");
  const [segment, setSegment] = useState(0);
  const counts = take === "first" ? firstCounts : retryCounts;
  return (
    <div className={styles.transcriptGraph}>
      <div className={styles.graphHeading}>
        <h4>Transcript timeline</h4>
        <div className={styles.takeSwitch} role="group" aria-label="Transcript take">
          <button type="button" aria-pressed={take === "first"} onClick={() => setTake("first")}>First take</button>
          <button type="button" aria-pressed={take === "retry"} onClick={() => setTake("retry")}>Retry</button>
        </div>
      </div>
      <p className={styles.graphHint}>Filler words per 10 seconds · select a segment</p>
      <div className={styles.graphBars} role="group" aria-label="Transcript segments">
        {counts.map((count, index) => (
          <button type="button" key={index} aria-pressed={segment === index} aria-controls="transcript-excerpt"
            aria-label={`${index * 10} to ${(index + 1) * 10} seconds: ${count} filler words`}
            onClick={() => setSegment(index)}>
            <span className={styles.barValue}>{count}</span>
            <span className={styles.barTrack} aria-hidden="true"><span className={take === "retry" ? styles.retryBar : styles.firstBar} style={{ height: `${count / 2 * 100}%` }} /></span>
            <span className={styles.barTime}>{index * 10}s</span>
          </button>
        ))}
      </div>
      <div className={styles.excerpt} id="transcript-excerpt" aria-live="polite" key={`${take}-${segment}`}>
        <span>{segment * 10}–{(segment + 1) * 10}s · {counts[segment]} fillers</span>
        <p><HighlightedTranscript text={landingSample[take][segment]} /></p>
      </div>
    </div>
  );
}

export function LandingPreview() {
  const [screen, setScreen] = useState<(typeof screens)[number]>("Discover");
  return (
    <section className={styles.preview} id="preview" aria-label="Interactive product preview" data-reveal>
      <div className={styles.previewHeader}>
        <span className={styles.previewTitle}>Your communication, unpacked.</span>
        <span className={styles.sampleBadge}>Synthetic sample · {landingSample.name} · 60-second takes</span>
      </div>
      <div className={styles.previewBody}>
        <aside className={styles.previewSidebar}>
          <div className={styles.screenButtons} role="group" aria-label="Preview screens">
            {screens.map((name) => (
              <button key={name} type="button" aria-pressed={screen === name} aria-controls="preview-content" onClick={() => setScreen(name)}>{name}</button>
            ))}
          </div>
          <Link href="/demo" className={styles.textLink}>Full demo</Link>
        </aside>
        <div className={styles.previewContent} id="preview-content" key={screen} aria-live="polite">
          {screen === "Discover" && <>
            <div className={styles.contentHeading}><h3>Small words. A visible pattern.</h3><span>First take · 60 seconds</span></div>
            <div className={styles.insight}>
              <div><p>Filler words in this sample</p><strong>{firstTotal}</strong><p>“um” and “uh” · {firstTotal} per minute</p></div>
              <SayLessDot mood="curious" color="jonquil" className={styles.insightFace} />
            </div>
            <blockquote className={styles.transcript}><HighlightedTranscript text={landingSample.first[0]} /></blockquote>
            <div className={styles.coach}><span aria-hidden="true">✳</span><div><strong>Give the next thought a beat.</strong><p>Try a brief pause where you would normally say “um.”</p></div></div>
          </>}
          {screen === "Practice" && <>
            <div className={styles.contentHeading}><h3>See exactly where you hesitate.</h3><span>Interactive transcript</span></div>
            <TranscriptGraph />
          </>}
          {screen === "Compare" && <>
            <div className={styles.contentHeading}><h3>Same idea. More breathing room.</h3><span>Equal 60-second samples</span></div>
            <div className={styles.improvement}>
              <span>After one illustrative retry</span>
              <strong>{reductionPercent}<span>%</span></strong>
              <h4>fewer filler words</h4>
              <p>{firstTotal} down to {retryTotal} in this synthetic example.</p>
              <SayLessDot mood="calm" color="mint" className={styles.resultDot} />
            </div>
            <div className={styles.compareChart}>
              <h4>Fillers per minute</h4>
              {[{ label: "First take", value: firstTotal }, { label: "Retry", value: retryTotal }].map(({ label, value }, index) => (
                <div className={styles.compareRow} key={label}>
                  <div><span>{label}</span><strong>{value}</strong></div>
                  <div className={styles.compareTrack}><span className={index ? styles.retryBar : styles.firstBar} style={{ width: `${value / firstTotal * 100}%` }} /></div>
                </div>
              ))}
              <p>Reduction = ({firstTotal} − {retryTotal}) ÷ {firstTotal}. Not a user average or a promised outcome.</p>
            </div>
          </>}
        </div>
        <details className={styles.methodNote}>
          <summary>About this sample &amp; the coaching approach</summary>
          <p>Both transcripts and their 10-second segments are illustrative, not recorded audio. We count only “um” and “uh” here; normal speech is not a flaw, and fewer fillers alone do not measure speaking quality.</p>
          <p>The coaching approach follows <a href="https://www.toastmasters.org/magazine/magazine-issues/2019/feb/sidebars/three-ways-to-make-ah-counting-count-for-more" target="_blank" rel="noreferrer">Toastmasters guidance on noticing recurring fillers and practicing pauses</a>. The {reductionPercent}% sample reduction is calculated from our fixture, not that source or a study.</p>
        </details>
      </div>
    </section>
  );
}
