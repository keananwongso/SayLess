import { pitchMetrics, type Take } from "@/lib/practice";

export const DAILY_XP = 40;

export const dailyChallenge = {
  id: "clear-pitch",
  title: "The clear-pitch challenge",
  prompt: "Make your project pitch in 20 seconds with two or fewer filler sounds.",
  xp: DAILY_XP,
};

export type ChallengeProgress = {
  completedDates: string[];
  xp: number;
};

export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function qualifiesForDailyChallenge(take?: Take) {
  if (!take) return false;
  const { fillers } = pitchMetrics(take);
  return take.seconds <= 20 && fillers.length <= 2;
}

export function fillerJarCount(takes: Take[]) {
  return takes.reduce((total, take) => total + pitchMetrics(take).fillers.length, 0);
}

export function currentStreak(completedDates: string[], today = new Date()) {
  const completed = new Set(completedDates);
  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  while (completed.has(localDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function improvementScore(takes: Take[]) {
  if (takes.length < 2) return 0;
  const first = pitchMetrics(takes[0]).fillers.length;
  const latest = pitchMetrics(takes.at(-1)!).fillers.length;
  return Math.max(0, first - latest) * 20;
}
