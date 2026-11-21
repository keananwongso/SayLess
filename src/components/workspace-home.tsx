"use client";

import { useState } from "react";
import { ConversationProjection } from "@/components/conversation-projection";
import { SayLessDot } from "@/components/sayless-dot";
import { saveChallengeProgress, useChallengeProgress } from "@/lib/challenge-progress";
import { currentStreak, dailyChallenge, DAILY_XP, localDay, qualifiesForDailyChallenge, type ChallengeTake } from "@/lib/challenges";
import { jadeConversationDuration, jadeExpressions, jadeGoal, jadeTopExpression } from "@/lib/jade-demo";
import styles from "./workspace-overview.module.css";

export function WorkspaceHome({ takes, onPractice, onFriends }: {
  takes: ChallengeTake[];
  onPractice: () => void;
  onFriends: () => void;
}) {
  const progress = useChallengeProgress();
  const [notice, setNotice] = useState("");
  const now = new Date();
  const today = localDay(now);
  const completed = new Set(progress.completedDates);
  const week = Array.from({ length: 7 }, (_, offset) => localDay(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset),
  ));
  const weekTotal = week.filter((date) => completed.has(date)).length;
  const streak = currentStreak(progress.completedDates, now);
  const completedToday = completed.has(today);
  const canClaim = !completedToday && qualifiesForDailyChallenge(takes.at(-1));

  function claim() {
    if (!canClaim) return;
    try {
      saveChallengeProgress({ completedDates: [...completed, today], xp: progress.xp + DAILY_XP });
      setNotice(`Daily quest complete. ${DAILY_XP} XP added.`);
    } catch {
      setNotice("This browser couldn’t save your XP.");
    }
  }

  async function copyAchievement() {
    try {
      await navigator.clipboard.writeText(`I completed today’s SayLess quest. ${progress.xp} XP and a ${streak}-day streak!`);
      setNotice("Achievement copied.");
    } catch {
      setNotice("Clipboard unavailable.");
    }
  }

  return (
    <section className={`flow ${styles.home}`} aria-labelledby="home-title">
      <div className={styles.greeting}>
        <h1 id="home-title" tabIndex={-1}>home.</h1>
        <p>{streak}-day streak</p>
      </div>

      <div className={styles.week}>
        <div><strong>{weekTotal}<span> / 7</span></strong><p>Check-ins in the last 7 days</p></div>
        <div className={styles.ring} aria-hidden="true" style={{ background: `conic-gradient(var(--color-ink) ${100 * weekTotal / 7}%, var(--color-surface) 0%)` }}>
          <SayLessDot className={styles.avatar} mood="calm" color="jonquil" />
        </div>
      </div>

      <dl className={styles.metrics}>
        <div><dt>Practice XP</dt><dd>{progress.xp}</dd></div>
        <div><dt>Takes this session</dt><dd>{takes.length}</dd></div>
      </dl>

      <article className={styles.card}>
        <div><p className="eyebrow muted">Daily quest</p><h2>{dailyChallenge.title}</h2></div>
        <p>{dailyChallenge.prompt}</p>
        {completedToday ? (
          <div className="action-row">
            <strong>Completed today</strong>
            <button className="secondary" onClick={copyAchievement}>Copy achievement</button>
          </div>
        ) : canClaim ? (
          <button className="primary" onClick={claim}>Claim {DAILY_XP} XP</button>
        ) : (
          <button className="primary" onClick={onPractice}>Do daily quest <span aria-hidden="true">→</span></button>
        )}
        {notice && <p className="footnote" role="status">{notice}</p>}
      </article>

      <button className={styles.friendsPreview} onClick={onFriends}>
        <SayLessDot className={styles.avatar} mood="bright" color="azure" />
        <span><strong>Friends</strong><span>Try a sample check-in with Jade and Riley</span></span>
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

export function WorkspaceStats({ takes, onAnalyze, onWrapped }: {
  takes: ChallengeTake[];
  onAnalyze: () => void;
  onWrapped: () => void;
}) {
  const recent = takes.slice(-7);
  const top = Math.max(1, ...recent.map(({ fillerCount }) => fillerCount));

  return (
    <section className="flow" aria-labelledby="stats-title">
      <h1 id="stats-title" tabIndex={-1}>stats.</h1>
      {recent.length > 0 && (
        <article className={styles.card}>
          <h2>Your recent practice</h2>
          <ol className={styles.practiceCounts} aria-label="Fillers by take">
            {recent.map(({ fillerCount, seconds }, index) => (
              <li key={index}>
                <span>Take {takes.length - recent.length + index + 1} · {Math.round(seconds)}s</span>
                <span className={styles.takeBar} aria-hidden="true"><span style={{ width: `${fillerCount / top * 100}%` }} /></span>
                <strong>{fillerCount}</strong>
              </li>
            ))}
          </ol>
        </article>
      )}
      <article className={`${styles.card} ${styles.statsRecap}`}>
        <div className={styles.recapTitle}>
          <div><h2>Jade’s Yap Recap</h2><p>Estimates · {jadeConversationDuration} demo · All speakers</p></div>
          <SayLessDot className={styles.recapDot} mood="curious" color="lavender" />
        </div>
        <dl className={styles.expressionCounts} aria-label="Estimated expression counts">
          {jadeExpressions.slice(0, 3).map(({ expression, count }) => (
            <div key={expression}>
              <dt>{expression}</dt>
              <dd>
                <span className={styles.takeBar} aria-hidden="true"><span style={{ width: `${100 * count / jadeTopExpression.count}%` }} /></span>
                <span>{count}</span>
              </dd>
            </div>
          ))}
        </dl>
      </article>
      <article className={`${styles.card} ${styles.statsGoal}`}>
        <div className={styles.goalTitle}>
          <h2>Two-week goal</h2>
          <p>≈{jadeGoal[0].count} <span aria-hidden="true">→</span><span className="sr-only"> to </span> {jadeGoal[2].count} “{jadeTopExpression.expression}”s</p>
        </div>
        <ConversationProjection />
      </article>
      <div className={styles.card}>
        <h2>Explore your habits</h2>
        <button className="secondary" onClick={onAnalyze}>Analyze a recording</button>
        <button className="secondary" onClick={onWrapped}>Open Wrapped</button>
      </div>
    </section>
  );
}
