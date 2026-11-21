"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConversationProjection } from "@/components/conversation-projection";
import { SayLessDot } from "@/components/sayless-dot";
import { jadeConversationDuration, jadeExpressions, jadeGoal, jadeTopExpression } from "@/lib/jade-demo";

const steps = [
  { id: "setup", label: "Sample upload" },
  { id: "wrapped", label: "Yap Recap" },
  { id: "projection", label: "Two-week goal" },
] as const;

const [baseline, , weekTwo] = jadeGoal;
const goalReduction = Math.round(100 * (baseline.count - weekTwo.count) / baseline.count);

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
                  <div><strong>conversation.m4a</strong><p>{jadeConversationDuration} · Sample audio</p></div>
                </div>
                <p className="demo-note" role="status">
                  {processing ? "Analyzing the sample…" : uploaded ? "Sample ready." : "This demo runs with a simulated upload."}
                </p>
              </>
            )}

            {step.id === "wrapped" && (
              <div className="demo-recap">
                <h1 id="demo-title" tabIndex={-1}>yap recap.</h1>
                <p className="demo-recap-source">Simulated conversation · {jadeConversationDuration} · all speakers</p>
                <div className="demo-recap-insight">
                  <p>Most frequent expression</p>
                  <p className="demo-recap-word">“{jadeTopExpression.expression}”</p>
                  <p>About <strong>{jadeTopExpression.count} times</strong></p>
                </div>
                <div className="demo-recap-breakdown">
                  <h2>Estimated expression counts</h2>
                  <dl>
                    {jadeExpressions.map(({ expression, count }) => (
                      <div key={expression}>
                        <dt>{expression}</dt>
                        <dd>
                          <span className="demo-recap-track" aria-hidden="true">
                            <span style={{ width: `${100 * count / jadeTopExpression.count}%` }} />
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
                  aim for {goalReduction}% fewer “{jadeTopExpression.expression}”s.
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
                <div className="demo-goal-chart"><ConversationProjection /></div>
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
