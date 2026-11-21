"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { currentStreak, dailyChallenge, DAILY_XP, fillerJarCount, improvementScore, localDay, qualifiesForDailyChallenge, type ChallengeProgress, type ChallengeTake } from "@/lib/challenges";

const STORAGE_KEY = "sayless-challenge-progress-v1";
const PROGRESS_CHANGE_EVENT = "sayless-challenge-progress-change";
const defaultProgress: ChallengeProgress = { completedDates: [], xp: 0 };
let cachedProgressValue: string | null | undefined;
let cachedProgress = defaultProgress;

function subscribeToProgress(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PROGRESS_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PROGRESS_CHANGE_EVENT, callback);
  };
}

function readProgress(): ChallengeProgress {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === cachedProgressValue) return cachedProgress;
    cachedProgressValue = stored;
    if (!stored) {
      cachedProgress = defaultProgress;
      return cachedProgress;
    }
    const candidate = JSON.parse(stored) as Partial<ChallengeProgress>;
    if (!Array.isArray(candidate.completedDates) || typeof candidate.xp !== "number") {
      cachedProgress = defaultProgress;
      return cachedProgress;
    }
    cachedProgress = { completedDates: candidate.completedDates.filter((day): day is string => typeof day === "string"), xp: candidate.xp };
    return cachedProgress;
  } catch {
    cachedProgress = defaultProgress;
    return cachedProgress;
  }
}

async function copyText(value: string) {
  if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
  await navigator.clipboard.writeText(value);
}

export function Challenges({ takes, onPractice }: { takes: ChallengeTake[]; onPractice: () => void }) {
  const progress = useSyncExternalStore(subscribeToProgress, readProgress, () => defaultProgress);
  const [notice, setNotice] = useState("");
  const today = localDay();
  const latestTake = takes.at(-1);
  const completedToday = progress.completedDates.includes(today);
  const canClaim = !completedToday && qualifiesForDailyChallenge(latestTake);
  const jarCount = fillerJarCount(takes);
  const streak = currentStreak(progress.completedDates);
  const improvement = improvementScore(takes);
  const latestFillers = latestTake?.fillerCount;

  function claimChallenge() {
    if (!canClaim) return;
    const next = {
      completedDates: [...new Set([...progress.completedDates, today])],
      xp: progress.xp + DAILY_XP,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(PROGRESS_CHANGE_EVENT));
    setNotice(`Daily challenge complete. ${DAILY_XP} XP added.`);
  }

  async function copyAchievement() {
    const text = `I completed today’s SayLess challenge: ${dailyChallenge.prompt} ${progress.xp} XP and a ${streak}-day streak.`;
    try {
      await copyText(text);
      setNotice("Achievement copied. Send it to a friend when you’re ready.");
    } catch {
      setNotice("Copy isn’t available in this browser. You can share your challenge from this screen.");
    }
  }

  async function copyNudge() {
    try {
      await copyText(`Want to try today’s SayLess challenge with me? ${dailyChallenge.prompt}`);
      setNotice("Accountability nudge copied.");
    } catch {
      setNotice("Copy isn’t available in this browser. Share the challenge text directly instead.");
    }
  }

  const duelStatus = useMemo(() => {
    if (takes.length < 2) return "Record two takes to unlock your improvement score.";
    return improvement >= 40
      ? `You’re ahead of Riley’s 20-point demo score with ${improvement} points.`
      : `You have ${improvement} points. Riley’s demo score is 20—one clearer retry can close the gap.`;
  }, [improvement, takes.length]);

  return (
    <section className="flow" aria-labelledby="challenges-title">
      <div className="results-heading">
        <div>
          <p className="eyebrow challenge-label">Challenges</p>
          <h1 id="challenges-title" tabIndex={-1}>Small reps.<br /><em>Real momentum.</em></h1>
        </div>
        <p className="streak-pill">{streak}-day streak · {progress.xp} XP</p>
      </div>

      <article className="daily-challenge">
        <div>
          <p className="eyebrow">Daily challenge</p>
          <h2>{dailyChallenge.title}</h2>
          <p>{dailyChallenge.prompt}</p>
          {latestTake && <p className="footnote">Latest take: {latestFillers} filler sound{latestFillers === 1 ? "" : "s"} in {Math.round(latestTake.seconds)} seconds.</p>}
        </div>
        <div className="challenge-actions">
          {completedToday ? (
            <><p className="complete-pill">Completed today · +{DAILY_XP} XP</p><button className="secondary" onClick={copyAchievement}>Copy achievement</button></>
          ) : canClaim ? (
            <button className="primary" onClick={claimChallenge}>Claim {DAILY_XP} XP <span aria-hidden="true">↗</span></button>
          ) : (
            <button className="primary" onClick={onPractice}>Practice this challenge <span aria-hidden="true">↗</span></button>
          )}
        </div>
      </article>

      <div className="challenge-grid">
        <article className="panel filler-jar" aria-labelledby="jar-title">
          <p className="eyebrow">Filler jar</p>
          <h2 id="jar-title"><span aria-hidden="true">◒</span> {jarCount}</h2>
          <p>{takes.length ? "Filler sounds logged from this browser session’s practice takes." : "Your jar starts counting when you record a practice take."}</p>
          <p className="footnote">A count is a cue to notice—not a judgment about how you speak.</p>
        </article>

        <article className="panel duel-card" aria-labelledby="duel-title">
          <p className="eyebrow">Friend duel</p>
          <h2 id="duel-title">Riley’s clear-pitch round</h2>
          <p>{duelStatus}</p>
          <p className="footnote">Local demo scoring rewards fewer filler sounds on a retry. Friend accounts are not connected yet.</p>
        </article>
      </div>

      <article className="accountability">
        <div>
          <p className="eyebrow">Accountability challenge</p>
          <h2>Bring a friend into the next rep.</h2>
          <p>Send the same prompt, then compare what changed—not who sounds “better.”</p>
        </div>
        <button className="secondary" onClick={copyNudge}>Copy a nudge</button>
      </article>
      {notice && <p className="status-note" role="status">{notice}</p>}
    </section>
  );
}
