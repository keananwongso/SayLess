"use client";

import { useState } from "react";
import Link from "next/link";
import { SayLessDot } from "./sayless-dot";
import { landingSample, firstTotal } from "@/lib/landing-sample";
import { TranscriptGraph, PracticeProjection } from "./landing-graphs";
import styles from "@/app/landing.module.css";

const screens = ["Discover", "Practice", "Compare"] as const;

function HighlightedTranscript({ text }: { text: string }) {
  return <>{text.split(/(\b(?:um|uh|like|wait|well)\b)/gi).map((part, index) =>
    /^(um|uh|like|wait|well)$/i.test(part) ? <mark key={index}>{part}</mark> : part)}</>;
}

export function LandingPreview() {
  const [screen, setScreen] = useState<(typeof screens)[number]>("Discover");
  return (
    <section className={styles.preview} id="preview" aria-label="Interactive product preview" data-reveal>
      <div className={styles.previewBody}>
        <aside className={styles.previewSidebar}>
          <div className={styles.screenButtons} role="group" aria-label="Preview screens">
            {screens.map((name) => (
              <button key={name} type="button" aria-pressed={screen === name} aria-controls="preview-content" onClick={() => setScreen(name)}>{name}</button>
            ))}
          </div>
          <Link href="/demo" className={styles.textLink}><span className={styles.fullLabel}>Full&nbsp;</span>demo</Link>
        </aside>
        <div className={styles.previewContent} id="preview-content" key={screen}>
          {screen === "Discover" && <>
            <div className={styles.insight}>
              <div><p>Filler words in this sample</p><strong>{firstTotal}</strong><p>Five example word types · {firstTotal} per minute</p></div>
              <SayLessDot mood="curious" color="jonquil" className={styles.insightFace} />
            </div>
            <blockquote className={styles.transcript}><HighlightedTranscript text={landingSample.first[0]} /></blockquote>
            <div className={styles.coach}><span aria-hidden="true">✳</span><div><strong>Give the next thought a beat.</strong><p>Try a brief pause where you would normally say “um.”</p></div></div>
          </>}
          {screen === "Practice" && <TranscriptGraph />}
          {screen === "Compare" && <PracticeProjection />}
        </div>
      </div>
    </section>
  );
}
