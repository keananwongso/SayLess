export const jadeConversationDuration = "2:23";

export const jadeExpressions = [
  { expression: "wait", count: 40 },
  { expression: "like", count: 35 },
  { expression: "yeah", count: 10 },
  { expression: "wow", count: 7 },
  { expression: "um / uh", count: 6 },
  { expression: "you know", count: 4 },
  { expression: "I mean", count: 2 },
] as const;

export const [jadeTopExpression] = jadeExpressions;

export const jadeGoal = [
  { label: "Today", count: jadeTopExpression.count },
  { label: "Week 1", count: Math.round(jadeTopExpression.count * 0.8) },
  { label: "Week 2", count: Math.round(jadeTopExpression.count * 0.6) },
] as const;
