"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SayLessDot } from "@/components/sayless-dot";

const steps = [
  { id: "setup", label: "Sample upload" },
  { id: "wrapped", label: "Yap Recap", action: "See the two-week goal" },
  { id: "projection", label: "Two-week goal", action: "Try a daily check-in" },
  { id: "check-in", label: "Daily check-in" },
  { id: "finish", label: "Friend progress" },
] as const;

const dailyTopics = [
  "Describe a tiny win from today.",
  "Pitch an app that should exist.",
  "Recommend something you watched.",
  "Explain a hobby to a beginner.",
  "Tell the story of an unexpected detour.",
  "Give your best study tip.",
  "Describe your ideal Saturday.",
  "Pitch a better morning routine.",
  "Tell us about a mistake you learned from.",
  "Make a case for your favorite snack.",
  "Describe a skill you want to learn.",
  "Explain how you solved a small problem.",
  "Suggest a weekend plan for a friend.",
  "Describe a place everyone should visit.",
  "Share advice you actually use.",
  "Talk about a person who inspires you.",
  "Pitch a fun idea for your team.",
  "Describe the best part of your week.",
  "Explain a feature you wish your phone had.",
  "Tell us about something worth celebrating.",
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
const projection = [
  { label: "Today", count: topExpression.count, x: 42 },
  { label: "Week 1", count: Math.round(topExpression.count * 0.8), x: 150 },
  { label: "Week 2", count: Math.round(topExpression.count * 0.6), x: 258 },
].map((point) => ({ ...point, y: 134 - point.count * 2.4 }));

const friends = [
  { name: "Jade", mood: "curious", color: "lavender", counts: [8, 7, 6, 5, 5, 4, 3] },
  { name: "Riley", mood: "bright", color: "azure", counts: [6, 6, 5, 5, 4, 3, 2] },
] as const;

function FriendProgress() {
  const summary = friends.map(({ name, counts }) => `${name}: ${counts.join(", ")}`).join(". ");

  return (
    <>
      <ul className="demo-friend-results" aria-label="Improvement from each person's baseline">
        {friends.map(({ name, mood, color, counts }) => {
          const start = counts[0];
          const end = counts[6];
          return (
            <li key={name}>
              <SayLessDot className="demo-friend-avatar" mood={mood} color={color} />
              <div>
                <strong>{name}</strong>
                <p><b>{start} → {end}</b> · {start - end} fewer</p>
              </div>
            </li>
          );
        })}
      </ul>
      <figure className="demo-projection demo-friend-chart">
        <figcaption>Filler sounds per 20-second check-in</figcaption>
        <svg viewBox="0 0 300 132" role="img" aria-labelledby="friend-progress-data">
          <title id="friend-progress-data">Simulated daily counts from day 1 through day 7. {summary}.</title>
          {[0, 4, 8].map((value) => (
            <g key={value}>
              <line className="demo-projection-grid" x1="27" x2="280" y1={107 - value * 11} y2={107 - value * 11} />
              <text x="19" y={111 - value * 11} textAnchor="end" className="demo-projection-label">{value}</text>
            </g>
          ))}
          {friends.map(({ name, counts }) => {
            const points = counts.map((count, day) => ({ x: 29 + day * 41, y: 107 - count * 11 }));
            return (
              <g key={name} className={name === "Jade" ? "demo-jade-series" : "demo-riley-series"}>
                <polyline points={points.map(({ x, y }) => `${x},${y}`).join(" ")} />
                {points.map(({ x, y }) => <circle key={x} cx={x} cy={y} r="3" />)}
              </g>
            );
          })}
          <text x="29" y="127" className="demo-projection-label">Day 1</text>
          <text x="275" y="127" textAnchor="end" className="demo-projection-label">Day 7</text>
        </svg>
        <div className="demo-friend-legend" aria-hidden="true"><span>Jade</span><span>Riley</span></div>
      </figure>
    </>
  );
}

export function GuidedDemo() {
  const [index, setIndex] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [topic, setTopic] = useState<string>();
  const [reel, setReel] = useState<string[]>([]);
  const pending = useRef<number | undefined>(undefined);
  const screen = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const previousIndex = useRef(0);
  const step = steps[index];

  useEffect(() => () => window.clearTimeout(pending.current), []);

  useEffect(() => {
    if (previousIndex.current === index) return;
    previousIndex.current = index;
    title.current?.focus({ preventScroll: true });
    screen.current?.scrollTo({ top: 0 });
  }, [index]);

  function simulate(delay: number, finish: () => void, start?: () => void) {
    if (pending.current !== undefined) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    setBusy(true);
    start?.();
    pending.current = window.setTimeout(() => {
      pending.current = undefined;
      setBusy(false);
      finish();
    }, delay);
  }

  function simulateUpload() {
    simulate(650, () => {
      setUploaded(true);
      setIndex(1);
    });
  }

  function rollTopic() {
    const selected = Math.floor(Math.random() * dailyTopics.length);
    simulate(640, () => {
      setTopic(dailyTopics[selected]);
      setReel([]);
    }, () => {
      setReel(Array.from({ length: 5 }, (_, turn) => (
        dailyTopics[(selected + dailyTopics.length + turn - 4) % dailyTopics.length]
      )));
    });
  }

  function restart() {
    setUploaded(false);
    setTopic(undefined);
    setReel([]);
    setIndex(0);
  }

  function advance() {
    if (step.id === "setup" && !uploaded) {
      simulateUpload();
    } else if (step.id === "check-in" && !topic) {
      rollTopic();
    } else {
      setIndex(index + 1);
    }
  }

  const action = step.id === "setup"
    ? uploaded ? "See Yap Recap" : busy ? "Processing…" : "Simulate upload"
    : step.id === "check-in"
      ? topic ? "Check in together" : busy ? "Rolling…" : "Roll a topic"
      : "action" in step ? step.action : undefined;

  return (
    <div className="app-surface demo-onboarding" data-step={step.id}>
      <main className="app-screen" id="main" ref={screen} tabIndex={-1}>
        <div className="demo-progress">
          <p><strong>{step.label}</strong> · {index + 1} of {steps.length}</p>
          <progress aria-label="Demo progress" value={index + 1} max={steps.length} />
        </div>

        <section className="demo-card" aria-labelledby="demo-title">
          <div className="demo-content" key={step.id}>
            {step.id === "setup" && (
              <>
                <SayLessDot className="demo-avatar" mood="curious" color="lavender" />
                <h1 id="demo-title" ref={title} tabIndex={-1}>meet <span className="demo-story-name">jade.</span></h1>
                <p className="demo-copy">See what SayLess finds in Jade’s sample conversation.</p>
                <div className="demo-file">
                  <span className="demo-file-icon" aria-hidden="true">♫</span>
                  <div><strong>conversation.m4a</strong><p>2:23 · Sample audio</p></div>
                </div>
                <p className="demo-note" role="status">
                  {busy ? "Analyzing the sample…" : uploaded ? "Sample ready." : "This demo runs with a simulated upload."}
                </p>
              </>
            )}

            {step.id === "wrapped" && (
              <div className="demo-recap">
                <h1 id="demo-title" ref={title} tabIndex={-1}>yap recap.</h1>
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
                <h1 id="demo-title" ref={title} tabIndex={-1}>where you could be in 2 weeks.</h1>
                <p className="demo-copy">One goal for Jade’s group is to pause before saying “{topExpression.expression}.”</p>
                <figure className="demo-projection">
                  <figcaption>Uses of “{topExpression.expression}” per 2:23 conversation</figcaption>
                  <svg viewBox="0 0 300 160" role="img" aria-labelledby="projection-description">
                    <title id="projection-description">{projection.map(({ label, count }) => `${label}: ${count}`).join(". ")}. Illustrative practice goal.</title>
                    {[0, 20, 40].map((value) => (
                      <line className="demo-projection-grid" key={value} x1="26" x2="274" y1={134 - value * 2.4} y2={134 - value * 2.4} />
                    ))}
                    <polyline className="demo-projection-line" points={projection.map(({ x, y }) => `${x},${y}`).join(" ")} />
                    {projection.map(({ label, count, x, y }) => (
                      <g key={label} textAnchor="middle">
                        <circle cx={x} cy={y} r="4.5" className="demo-projection-point" />
                        <text x={x} y={y - 12} className="demo-projection-value">{count}</text>
                        <text x={x} y="155" className="demo-projection-label">{label}</text>
                      </g>
                    ))}
                  </svg>
                </figure>
                <p className="demo-note">Simulated baseline and example targets with daily practice.</p>
              </>
            )}

            {step.id === "check-in" && (
              <>
                <h1 id="demo-title" ref={title} tabIndex={-1}>daily check-in.</h1>
                <ul className="demo-friend-pair" aria-label="Check-in partners">
                  {friends.map(({ name, mood, color }) => (
                    <li key={name}><SayLessDot className="demo-friend-avatar" mood={mood} color={color} /><strong>{name}</strong></li>
                  ))}
                </ul>
                <p className="demo-copy">Jade and Riley each get 20 seconds on the same topic.</p>
                <div className="demo-topic">
                  <p className="eyebrow">Today’s prompt</p>
                  <div className="demo-topic-window">
                    {reel.length > 0 && (
                      <div className="demo-topic-reel" aria-hidden="true">
                        {reel.map((prompt) => <p key={prompt}>{prompt}</p>)}
                      </div>
                    )}
                    <p role="status" className={busy ? "sr-only" : "demo-topic-result"}>{topic}</p>
                    {!topic && !busy && <p className="demo-topic-placeholder">Roll to reveal it.</p>}
                  </div>
                </div>
              </>
            )}

            {step.id === "finish" && (
              <>
                <h1 id="demo-title" ref={title} tabIndex={-1}>better together.</h1>
                <p className="demo-copy">Today’s prompt <strong>{topic}</strong></p>
                <FriendProgress />
                <p className="demo-note">Simulated week · each friend improves from their own baseline.</p>
              </>
            )}
          </div>
        </section>
      </main>
      <footer className="app-dock demo-controls">
        {step.id === "finish" ? (
          <>
            <Link href="/app#practice" className="primary">Try it with your voice <span aria-hidden="true">→</span></Link>
            <div className="demo-finish-links">
              <button className="demo-text-link" onClick={() => setIndex(index - 1)}>Back</button>
              <button className="demo-text-link" onClick={restart}>Restart demo</button>
            </div>
          </>
        ) : (
          <>
            {index > 0 && <button className="demo-text-link" disabled={busy} onClick={() => setIndex(index - 1)}>Back</button>}
            <button className="primary" disabled={busy} onClick={advance}>{action}{!busy && <span aria-hidden="true">→</span>}</button>
          </>
        )}
      </footer>
    </div>
  );
}
