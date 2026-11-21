"use client";

import { useState } from "react";
import Link from "next/link";
import { sampleProfiles } from "@/lib/sample-pitches";
import styles from "@/app/landing.module.css";

const screens = ["Discover", "Practice", "Compare"] as const;
const sample = sampleProfiles[0];
const fillerCounts = sample.takes.map((take) => take.events?.filter((event) => event.kind === "filler").length ?? 0);

export function LandingPreview() {
  const [screen, setScreen] = useState<(typeof screens)[number]>("Discover");

  return (
    <section className={styles.preview} aria-label="Interactive product preview">
      <div className={styles.previewHeader}>
        <span className={styles.previewTitle}>A little look inside</span>
        <span className={styles.sampleBadge}>Synthetic sample · {sample.name}</span>
      </div>
      <div className={styles.previewBody}>
        <aside className={styles.previewSidebar}>
          <p className={styles.kicker}>Your next aha moment</p>
          <h2>meet your<br />speaking habits.</h2>
          <p>One short pitch. One helpful nudge. A chance to try again.</p>
          <div className={styles.screenButtons} role="group" aria-label="Preview screens">
            {screens.map((name) => (
              <button key={name} type="button" aria-pressed={screen === name} aria-controls="preview-content" onClick={() => setScreen(name)}>{name}</button>
            ))}
          </div>
          <Link href="/demo" className={styles.textLink}>Open the guided demo</Link>
        </aside>
        <div className={styles.previewContent} id="preview-content" aria-live="polite">
          {screen === "Discover" && (
            <>
              <div className={styles.contentHeading}><h3>A familiar little word.</h3><span>First take</span></div>
              <div className={styles.insight}>
                <div><p>Your most noticeable filler</p><strong>“um”</strong><p>{fillerCounts[0]} times in {sample.takes[0].seconds.toFixed(1)} seconds</p></div>
                <span className={styles.insightFace} aria-hidden="true">··</span>
              </div>
              <blockquote className={styles.transcript}>“{sample.takes[0].transcript}”</blockquote>
              <div className={styles.coach}><span aria-hidden="true">✳</span><div><strong>One thing to try</strong><p>{sample.takes[0].suggestion}</p></div></div>
            </>
          )}
          {screen === "Practice" && (
            <>
              <div className={styles.contentHeading}><h3>Make room for a pause.</h3><span>Sample audio</span></div>
              <div className={styles.prompt}><p>The prompt</p><h4>Pitch a project you care about.</h4><p>Who is it for, and what does it help them do?</p></div>
              <p className={styles.audioLabel}>Listen to {sample.name}’s original take</p>
              <audio key="original" controls preload="none" src={sample.takes[0].audio} aria-label="Alex's original sample pitch" />
              <div className={styles.coach}><span aria-hidden="true">✳</span><div><strong>Keep it simple</strong><p>Try one suggestion at a time. The goal is to sound like you.</p></div></div>
            </>
          )}
          {screen === "Compare" && (
            <>
              <div className={styles.contentHeading}><h3>A small change you can hear.</h3><span>Two sample takes</span></div>
              <div className={styles.comparison}>
                <div><p>First take</p><strong>{fillerCounts[0]}</strong><span>filler words</span></div>
                <div><p>After a retry</p><strong>{fillerCounts[1]}</strong><span>filler word</span></div>
              </div>
              <p className={styles.audioLabel}>Listen to {sample.name}’s retry</p>
              <audio key="retry" controls preload="none" src={sample.takes[1].audio} aria-label="Alex's retry sample pitch" />
              <p className={styles.sampleNote}>Illustrative sample, not a promise of results. Your practice is your own.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
