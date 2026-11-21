import { useId } from "react";
import { jadeConversationDuration, jadeGoal, jadeTopExpression } from "@/lib/jade-demo";
import styles from "./conversation-projection.module.css";

const countToY = (count: number) => 138 - count * 2.8;
const points = jadeGoal.map(({ label, count }, index) => ({ label, count, x: 36 + index * 119, y: countToY(count) }));
const [baseline, weekOne, weekTwo] = points;
const targetPath = points.map(({ x, y }) => `${x},${y}`).join(" ");

export function ConversationProjection() {
  const descriptionId = useId();

  return (
    <figure className={styles.chart}>
      <figcaption>Per {jadeConversationDuration} group conversation</figcaption>
      <svg viewBox="0 0 310 168" role="img" aria-labelledby={descriptionId}>
        <title id={descriptionId}>The recap baseline is about {baseline.count} uses of “{jadeTopExpression.expression}” and stays flat as a comparison. The practice targets are {weekOne.count} in week one and {weekTwo.count} in week two.</title>
        {[0, 20, baseline.count].map((value) => (
          <g key={value}>
            <text className={styles.label} x="24" y={countToY(value)} textAnchor="end" dominantBaseline="central">{value}</text>
            {value !== baseline.count && <line className={styles.gridLine} x1={baseline.x} x2={weekTwo.x} y1={countToY(value)} y2={countToY(value)} />}
          </g>
        ))}
        <polygon className={styles.area} points={`${targetPath} ${weekTwo.x},${baseline.y}`} />
        <line className={styles.baseline} x1={baseline.x} x2={weekTwo.x} y1={baseline.y} y2={baseline.y} />
        <polyline className={styles.targetLine} points={targetPath} />
        {points.map(({ label, count, x, y }, index) => (
          <g key={label} textAnchor="middle">
            <circle cx={x} cy={y} r="4.5" className={index === 0 ? styles.point : styles.targetPoint} />
            {index > 0 && <text x={x} y={y + 23} className={styles.value}>{count}</text>}
            <text x={x} y="160" className={styles.label}>{label}</text>
          </g>
        ))}
      </svg>
      <ul className={styles.key} aria-hidden="true">
        <li>Recap baseline</li>
        <li>Practice targets</li>
      </ul>
    </figure>
  );
}
