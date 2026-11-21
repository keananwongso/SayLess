export const DAILY_XP = 40;

export const dailyChallenge = {
  id: "clear-pitch",
  title: "The clear-pitch challenge",
  prompt: "Make your project pitch in 20 seconds with two or fewer filler sounds.",
  xp: DAILY_XP,
};

export type ChallengeTake = { seconds: number; fillerCount: number };

export type ChallengeProgress = {
  completedDates: string[];
  xp: number;
};

export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function qualifiesForDailyChallenge(take?: ChallengeTake) {
  if (!take) return false;
  return take.seconds <= 20 && take.fillerCount <= 2;
}

export function fillerJarCount(takes: ChallengeTake[]) {
  return takes.reduce((total, take) => total + take.fillerCount, 0);
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

export function improvementScore(takes: ChallengeTake[]) {
  if (takes.length < 2) return 0;
  const first = takes[0].fillerCount;
  const latest = takes[takes.length - 1].fillerCount;
  return Math.max(0, first - latest) * 20;
}
