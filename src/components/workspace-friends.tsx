"use client";

import { useEffect, useRef, useState } from "react";
import { SayLessDot } from "@/components/sayless-dot";
import { dailyChallenge } from "@/lib/challenges";
import overview from "./workspace-overview.module.css";
import styles from "./workspace-friends.module.css";

const dailyTopics = [
  "Describe a tiny win from today.",
  "Pitch an app that should exist.",
  "Recommend something you watched.",
  "Explain a hobby to a beginner.",
  "Tell the story of an unexpected detour.",
  "Give your best study tip.",
  "Describe your ideal Saturday.",
  "Pitch a better morning routine.",
  "Tell us about a mistake you learned from.",
  "Make a case for your favorite snack.",
  "Describe a skill you want to learn.",
  "Explain how you solved a small problem.",
  "Suggest a weekend plan for a friend.",
  "Describe a place everyone should visit.",
  "Share advice you actually use.",
  "Talk about a person who inspires you.",
  "Pitch a fun idea for your team.",
  "Describe the best part of your week.",
  "Explain a feature you wish your phone had.",
  "Tell us about something worth celebrating.",
] as const;

const friends = [
  { name: "Jade", mood: "curious", color: "lavender", counts: [8, 7, 6, 5, 5, 4, 3] },
  { name: "Riley", mood: "bright", color: "azure", counts: [6, 6, 5, 5, 4, 3, 2] },
] as const;

function FriendProgress() {
  const summary = friends.map(({ name, counts }) => `${name}: ${counts.join(", ")}`).join(". ");

  return (
    <>
      <ul className={styles.results} aria-label="Improvement from each person's baseline">
        {friends.map(({ name, mood, color, counts }) => {
          const start = counts[0];
          const end = counts[6];
          return (
            <li key={name}>
              <SayLessDot className={styles.avatar} mood={mood} color={color} />
              <div>
                <strong>{name}</strong>
                <p><b>{start} → {end}</b> · {start - end} fewer</p>
              </div>
            </li>
          );
        })}
      </ul>
      <figure className={styles.chart}>
        <figcaption>Filler sounds per 20-second check-in</figcaption>
        <svg viewBox="0 0 300 132" role="img" aria-labelledby="friend-progress-data">
          <title id="friend-progress-data">Simulated daily counts from day 1 through day 7. {summary}.</title>
          {[0, 4, 8].map((value) => (
            <g key={value}>
              <line className={styles.gridLine} x1="27" x2="280" y1={107 - value * 11} y2={107 - value * 11} />
              <text x="19" y={111 - value * 11} textAnchor="end" className={styles.chartLabel}>{value}</text>
            </g>
          ))}
          {friends.map(({ name, counts }) => {
            const points = counts.map((count, day) => ({ x: 29 + day * 41, y: 107 - count * 11 }));
            return (
              <g key={name} className={name === "Jade" ? styles.jade : styles.riley}>
                <polyline points={points.map(({ x, y }) => `${x},${y}`).join(" ")} />
                {points.map(({ x, y }) => <circle key={x} cx={x} cy={y} r="3" />)}
              </g>
            );
          })}
          <text x="29" y="127" className={styles.chartLabel}>Day 1</text>
          <text x="275" y="127" textAnchor="end" className={styles.chartLabel}>Day 7</text>
        </svg>
        <div className={styles.legend} aria-hidden="true"><span>Jade</span><span>Riley</span></div>
      </figure>
    </>
  );
}

export function WorkspaceFriends() {
  const [notice, setNotice] = useState("");
  const [topic, setTopic] = useState<string>();
  const [reel, setReel] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const sampleProgress = useRef<HTMLHeadingElement>(null);
  const rolling = reel.length > 0;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(`Want to try today’s SayLess quest with me? ${dailyChallenge.prompt}`);
      setNotice("Quest prompt copied.");
    } catch {
      setNotice("Clipboard unavailable.");
    }
  }

  function roll() {
    if (timer.current !== undefined) return;
    const selected = Math.floor(Math.random() * dailyTopics.length);
    function reveal() {
      timer.current = undefined;
      setTopic(dailyTopics[selected]);
      setReel([]);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }
    setReel(Array.from({ length: 5 }, (_, turn) => dailyTopics[(selected + dailyTopics.length + turn - 4) % dailyTopics.length]));
    timer.current = window.setTimeout(reveal, 640);
  }

  useEffect(() => {
    if (completed) sampleProgress.current?.focus();
  }, [completed]);

  return (
    <section className="flow" aria-labelledby="friends-title">
      <h1 id="friends-title" tabIndex={-1}>friends.</h1>

      <article className={`${overview.card} ${styles.quest}`} aria-labelledby="sample-friends-title">
        <div className={styles.hero}>
          <h2 id="sample-friends-title">Sample friend quest</h2>
          <ul className={styles.pair} aria-label="Check-in partners">
            {friends.map(({ name, mood, color }) => (
              <li key={name}>
                <span className={styles.friendPortrait}><SayLessDot className={styles.face} mood={mood} color={color} /></span>
                <strong>{name}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.questBody}>
          <div className={styles.topic}>
            <p className="eyebrow">{rolling || topic ? "Their topic" : "One topic · 20 seconds each"}</p>
            <div className={styles.window} data-rolling={rolling}>
              {rolling && <div className={styles.reel} aria-hidden="true">{reel.map(prompt => <p key={prompt}>{prompt}</p>)}</div>}
              <p role="status" className={styles.result}>{topic}</p>
            </div>
          </div>
          {completed ? (
            <>
              <h2 ref={sampleProgress} tabIndex={-1}>Their week in practice</h2>
              <FriendProgress />
            </>
          ) : topic ? (
            <button className="primary" onClick={() => setCompleted(true)}>See sample progress</button>
          ) : (
            <button className="primary" disabled={rolling} onClick={roll}>{rolling ? "Rolling…" : "Roll a topic"}</button>
          )}
        </div>
      </article>

      <article className={overview.card}>
        <h2>Share today’s quest</h2>
        <p>{dailyChallenge.prompt}</p>
        <button className="secondary" onClick={copyPrompt}>Copy quest prompt</button>
        {notice && <p className="footnote" role="status">{notice}</p>}
      </article>
    </section>
  );
}
