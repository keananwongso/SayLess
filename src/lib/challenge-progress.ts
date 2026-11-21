import { useSyncExternalStore } from "react";
import type { ChallengeProgress } from "./challenges";

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

export function useChallengeProgress() {
  return useSyncExternalStore(subscribeToProgress, readProgress, () => defaultProgress);
}

export function saveChallengeProgress(progress: ChallengeProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(PROGRESS_CHANGE_EVENT));
}
