"use client";

import { useState, type FormEvent } from "react";
import { SayLessDot } from "@/components/sayless-dot";
import { useChallengeProgress } from "@/lib/challenge-progress";
import { currentStreak, fillerJarCount, localDay, type ChallengeTake } from "@/lib/challenges";
import styles from "./profile.module.css";

const nameKey = "sayless-profile-name";

function readName() {
  try {
    return window.localStorage.getItem(nameKey) || "Your profile";
  } catch {
    return "Your profile";
  }
}

export function Profile({ takes, onPractice }: { takes: ChallengeTake[]; onPractice: () => void }) {
  const progress = useChallengeProgress();
  const [name, setName] = useState(readName);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const today = new Date();
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + index);
    return {
      date: localDay(date),
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      completed: progress.completedDates.includes(localDay(date)),
    };
  });
  const completedThisWeek = week.filter((day) => day.completed).length;

  function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    if (!value) {
      setError("Enter a display name.");
      return;
    }
    try {
      window.localStorage.setItem(nameKey, value);
      setName(value);
      setEditing(false);
      setError("");
    } catch {
      setError("This browser couldn’t save your name.");
    }
  }

  return (
    <section className="flow" aria-labelledby="profile-heading">
      <div className={styles.hero}>
        <div className={styles.banner}>
          <SayLessDot className={styles.avatar} mood="bright" color="lavender" />
        </div>
        <h1 id="profile-heading" tabIndex={-1}>{name}</h1>
      </div>

      {editing ? (
        <form className={styles.edit} onSubmit={saveName}>
          <label htmlFor="profile-name">Display name</label>
          <input id="profile-name" name="name" defaultValue={name === "Your profile" ? "" : name} maxLength={40} required />
          <div className="action-row">
            <button type="submit" className="primary">Save name</button>
            <button type="button" className="secondary" onClick={() => { setEditing(false); setError(""); }}>Cancel</button>
          </div>
          {error && <p className="alert" role="alert">{error}</p>}
        </form>
      ) : (
        <button className={styles.textAction} onClick={() => setEditing(true)}>Edit name</button>
      )}

      <dl className={styles.metrics}>
        <div><dt>Total XP</dt><dd>{progress.xp}</dd></div>
        <div><dt>Day streak</dt><dd>{currentStreak(progress.completedDates)}</dd></div>
        <div><dt>Takes this session</dt><dd>{takes.length}</dd></div>
      </dl>

      <article className={`panel ${styles.week}`}>
        <h2>Last 7 days</h2>
        <p>{completedThisWeek} {completedThisWeek === 1 ? "daily challenge" : "daily challenges"} completed</p>
        <ol className={styles.days}>
          {week.map(({ date, label, completed }) => (
            <li key={date} data-completed={completed}>
              <span aria-hidden="true">{completed ? "✓" : "·"}</span>
              <abbr title={date}>{label}</abbr>
              <span className="sr-only">{completed ? "Complete" : "No challenge completed"}</span>
            </li>
          ))}
        </ol>
      </article>

      {takes.length > 0 && <p className="footnote muted">Filler jar this session · {fillerJarCount(takes)}</p>}
      <button className="primary" onClick={onPractice}>Practice your pitch</button>
    </section>
  );
}
