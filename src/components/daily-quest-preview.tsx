"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import styles from "./workspace-overview.module.css";

const topics = [
  "Describe a tiny win from today.",
  "Pitch an app that should exist.",
  "Recommend something you watched.",
  "Explain a hobby to a beginner.",
  "Tell the story of an unexpected detour.",
  "Give your best study tip.",
] as const;

const duration = 20;

export function DailyQuestPreview() {
  const [topic, setTopic] = useState<string>(topics[0]);
  const [reel, setReel] = useState<string[]>([]);
  const [remaining, setRemaining] = useState(duration);
  const [started, setStarted] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const rollTimer = useRef<number | undefined>(undefined);
  const rollButton = useRef<HTMLButtonElement>(null);
  const recording = started && remaining > 0;

  useEffect(() => () => window.clearTimeout(rollTimer.current), []);

  useEffect(() => {
    if (!recording) return;
    const interval = window.setInterval(() => setRemaining((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [recording]);

  function roll() {
    if (rollTimer.current !== undefined) return;
    const selected = Math.floor(Math.random() * topics.length);
    const sequence = Array.from({ length: 5 }, (_, index) => topics[(selected + topics.length + index - 4) % topics.length]);

    function reveal() {
      rollTimer.current = undefined;
      flushSync(() => {
        setTopic(topics[selected]);
        setReel([]);
      });
      dialog.current?.showModal();
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    setReel(sequence);
    rollTimer.current = window.setTimeout(reveal, 640);
  }

  function close() {
    setStarted(false);
    setRemaining(duration);
    rollButton.current?.focus();
  }

  return (
    <>
      {reel.length > 0 && (
        <div className={styles.questWindow} aria-hidden="true">
          <div className={styles.questReel}>{reel.map((prompt) => <p key={prompt}>{prompt}</p>)}</div>
        </div>
      )}
      <button className="primary" ref={rollButton} disabled={reel.length > 0} onClick={roll}>
        {reel.length > 0 ? "Rolling…" : "Roll daily quest"}
      </button>

      <dialog ref={dialog} className={styles.questDialog} aria-labelledby="quest-topic" onClose={close}>
        <div className={styles.questDialogBody}>
          <p className="eyebrow muted">Daily quest · Recording preview</p>
          <h2 id="quest-topic">{topic}</h2>
          <p className="muted">Try a 20-second answer. Audio capture is off in this preview.</p>
          <div className={styles.questTimer}>
            <strong role="timer">0:{String(remaining).padStart(2, "0")}</strong>
            <span role="status">{recording ? "Recording preview" : started ? "Preview complete" : "Ready"}</span>
          </div>
          <button className="primary" onClick={() => {
            if (recording) {
              setRemaining(0);
              return;
            }
            setRemaining(duration);
            setStarted(true);
          }}>
            {recording ? "Stop recording" : started ? "Try again" : "Start recording"}
          </button>
          <form method="dialog"><button className="secondary">Close</button></form>
        </div>
      </dialog>
    </>
  );
}
