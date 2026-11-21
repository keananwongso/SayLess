"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SayLessDot } from "@/components/sayless-dot";

const steps = [
  { id: "setup", label: "Sample upload" },
  { id: "wrapped", label: "Yap Recap" },
  { id: "projection", label: "Two-week goal" },
] as const;

const simulatedExpressions = [
  { expression: "wait", count: 40 },
  { expression: "like", count: 35 },
  { expression: "yeah", count: 10 },
  { expression: "wow", count: 7 },
  { expression: "um / uh", count: 6 },
  { expression: "you know", count: 4 },
  { expression: "I mean", count: 2 },
] as const;
const [topExpression] = simulatedExpressions;
const chartBottom = 138;
const countToY = (count: number) => chartBottom - count * 2.8;
const projection = [
  { label: "Today", count: topExpression.count, x: 36 },
  { label: "Week 1", count: Math.round(topExpression.count * 0.8), x: 155 },
  { label: "Week 2", count: Math.round(topExpression.count * 0.6), x: 274 },
].map((point) => ({ ...point, y: countToY(point.count) }));
const [baseline, weekOne, weekTwo] = projection;
const goalReduction = Math.round(100 * (baseline.count - weekTwo.count) / baseline.count);
const targetPath = projection.map(({ x, y }) => `${x},${y}`).join(" ");

export function GuidedDemo() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">();
  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const pending = useRef<number | undefined>(undefined);
  const screen = useRef<HTMLElement>(null);
  const previousIndex = useRef(0);
  const step = steps[index];

  useEffect(() => () => window.clearTimeout(pending.current), []);

  useEffect(() => {
    if (previousIndex.current === index) return;
    previousIndex.current = index;
    screen.current?.querySelector("h1")?.focus({ preventScroll: true });
    screen.current?.scrollTo({ top: 0 });
  }, [index]);

  function goTo(nextIndex: number) {
    setDirection(nextIndex > index ? "forward" : "back");
    setIndex(nextIndex);
  }

  function upload() {
    if (pending.current !== undefined) return;
    if (uploaded) {
      goTo(1);
      return;
    }

    function finish() {
      pending.current = undefined;
      setProcessing(false);
      setUploaded(true);
      goTo(1);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    setProcessing(true);
    pending.current = window.setTimeout(finish, 650);
  }

  return (
    <div className="app-surface demo-onboarding" data-step={step.id} data-direction={direction}>
      <main className="app-screen" id="main" ref={screen} tabIndex={-1}>
        <div className="demo-progress">
          <p><strong>{step.label}</strong> · {index + 1} of {steps.length}</p>
          <div className="demo-progress-track" role="progressbar" aria-label="Demo progress" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={index + 1}>
            <span style={{ width: `${100 * (index + 1) / steps.length}%` }} />
          </div>
        </div>

        <section className="demo-card" key={step.id} aria-labelledby="demo-title">
          <div className="demo-content">
            {step.id === "setup" && (
              <>
                <SayLessDot className="demo-avatar" mood="curious" color="lavender" />
                <h1 id="demo-title" tabIndex={-1}>meet <span className="demo-story-name">jade.</span></h1>
                <p className="demo-copy">See what SayLess finds in Jade’s sample conversation.</p>
                <div className="demo-file">
                  <span className="demo-file-icon" aria-hidden="true">♫</span>
                  <div><strong>conversation.m4a</strong><p>2:23 · Sample audio</p></div>
                </div>
                <p className="demo-note" role="status">
                  {processing ? "Analyzing the sample…" : uploaded ? "Sample ready." : "This demo runs with a simulated upload."}
                </p>
              </>
            )}

            {step.id === "wrapped" && (
              <div className="demo-recap">
                <h1 id="demo-title" tabIndex={-1}>yap recap.</h1>
                <p className="demo-recap-source">Simulated conversation · 2:23 · all speakers</p>
                <div className="demo-recap-insight">
                  <p>Most frequent expression</p>
                  <p className="demo-recap-word">“{topExpression.expression}”</p>
                  <p>About <strong>{topExpression.count} times</strong></p>
                </div>
                <div className="demo-recap-breakdown">
                  <h2>Estimated expression counts</h2>
                  <dl>
                    {simulatedExpressions.map(({ expression, count }) => (
                      <div key={expression}>
                        <dt>{expression}</dt>
                        <dd>
                          <span className="demo-recap-track" aria-hidden="true">
                            <span style={{ width: `${100 * count / topExpression.count}%` }} />
                          </span>
                          <span>{count}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {step.id === "projection" && (
              <>
                <h1 id="demo-title" className="demo-goal-title" tabIndex={-1}>
                  aim for {goalReduction}% fewer “{topExpression.expression}”s.
                </h1>
                <dl className="demo-goal-summary">
                  <div>
                    <dt>Recap baseline</dt>
                    <dd><span className="demo-goal-approx">≈</span>{baseline.count}</dd>
                  </div>
                  <div>
                    <dt>Week 2 target</dt>
                    <dd>{weekTwo.count}</dd>
                  </div>
                </dl>
                <figure className="demo-goal-chart">
                  <figcaption>Per 2:23 group conversation</figcaption>
                  <svg viewBox="0 0 310 168" role="img" aria-labelledby="projection-description">
                    <title id="projection-description">The recap baseline is about {baseline.count} uses of “{topExpression.expression}” and stays flat as a comparison. The practice targets are {weekOne.count} in week one and {weekTwo.count} in week two.</title>
                    {[0, 20, baseline.count].map((value) => (
                      <g key={value}>
                        <text className="demo-projection-label" x="24" y={countToY(value)} textAnchor="end" dominantBaseline="central">{value}</text>
                        {value !== baseline.count && <line className="demo-projection-grid" x1={baseline.x} x2={weekTwo.x} y1={countToY(value)} y2={countToY(value)} />}
                      </g>
                    ))}
                    <polygon className="demo-goal-area" points={`${targetPath} ${weekTwo.x},${baseline.y}`} />
                    <line className="demo-projection-baseline" x1={baseline.x} x2={weekTwo.x} y1={baseline.y} y2={baseline.y} />
                    <polyline className="demo-projection-line" points={targetPath} />
                    {projection.map(({ label, count, x, y }, position) => (
                      <g key={label} textAnchor="middle">
                        <circle cx={x} cy={y} r="4.5" className={position === 0 ? "demo-projection-point" : "demo-projection-target"} />
                        {position > 0 && <text x={x} y={y + 23} className="demo-projection-value">{count}</text>}
                        <text x={x} y="160" className="demo-projection-label">{label}</text>
                      </g>
                    ))}
                  </svg>
                  <ul className="demo-goal-key" aria-hidden="true">
                    <li>Recap baseline</li>
                    <li>Practice targets</li>
                  </ul>
                </figure>
              </>
            )}

          </div>
        </section>
      </main>
      <footer className="app-dock demo-controls">
        {index > 0 && <button className="demo-text-link" onClick={() => goTo(index - 1)}>Back</button>}
        {step.id === "setup" && (
          <button className="primary" disabled={processing} onClick={upload}>
            {uploaded ? "See Yap Recap" : processing ? "Processing…" : "Simulate upload"}
            {!processing && <span aria-hidden="true">→</span>}
          </button>
        )}
        {step.id === "wrapped" && (
          <button className="primary" onClick={() => goTo(2)}>See the two-week goal <span aria-hidden="true">→</span></button>
        )}
        {step.id === "projection" && (
          <Link href="/app" className="primary">Use SayLess <span aria-hidden="true">→</span></Link>
        )}
      </footer>
    </div>
  );
}
