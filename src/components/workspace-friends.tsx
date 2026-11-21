"use client";

import { useState } from "react";
import { SayLessDot } from "@/components/sayless-dot";
import { dailyChallenge } from "@/lib/challenges";
import overview from "./workspace-overview.module.css";
import styles from "./workspace-friends.module.css";

const sampleFriends = [
  { name: "Jade", mood: "curious", color: "lavender", streak: 7 },
  { name: "Riley", mood: "bright", color: "azure", streak: 5 },
  { name: "Sam", mood: "calm", color: "mint", streak: 3 },
  { name: "Morgan", mood: "pause", color: "melon", streak: 1 },
] as const;

export function WorkspaceFriends() {
  const [notice, setNotice] = useState("");

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(`Want to try the SayLess project pitch quest with me? ${dailyChallenge.prompt}`);
      setNotice("Quest prompt copied.");
    } catch {
      setNotice("Clipboard unavailable.");
    }
  }

  return (
    <section className="flow" aria-labelledby="friends-title">
      <h1 id="friends-title" tabIndex={-1}>friends.</h1>

      <article className={overview.card} aria-labelledby="sample-friends-title">
        <h2 id="sample-friends-title">Sample friends</h2>
        <ul className={styles.list} role="list">
          {sampleFriends.map(({ name, mood, color, streak }) => (
            <li key={name}>
              <SayLessDot className={styles.avatar} mood={mood} color={color} />
              <strong>{name}</strong>
              <span className={styles.streak}>{streak}-day streak</span>
            </li>
          ))}
        </ul>
      </article>

      <article className={overview.card}>
        <h2>Share the pitch quest</h2>
        <p>{dailyChallenge.prompt}</p>
        <button className="secondary" onClick={copyPrompt}>Copy quest prompt</button>
        {notice && <p className="footnote" role="status">{notice}</p>}
      </article>
    </section>
  );
}
