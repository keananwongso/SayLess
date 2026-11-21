"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SayLessDot } from "@/components/sayless-dot";
import { useTakePlayback } from "@/components/use-take-playback";
import { dailyChallenge, fillerJarCount, improvementScore, qualifiesForDailyChallenge } from "@/lib/challenges";
import { chooseRule, pitchMetrics, PITCH_PROMPT, type Filler, type FillerEvent, type Take } from "@/lib/practice";
import { sampleProfiles } from "@/lib/sample-pitches";
import { speak, stopSpeech } from "@/lib/speech";
import { loadTakeAudio } from "@/lib/take-audio";

const steps = [
  { id: "setup", label: "Meet Jade", action: "See Jade’s Yap Recap" },
  { id: "wrapped", label: "Yap Recap", action: "See the two-week goal" },
  { id: "projection", label: "Two-week goal", action: "Start practice" },
  { id: "practice", label: "Practice", action: "Hear the retry" },
  { id: "compare", label: "Compare", action: "Finish the challenge" },
  { id: "finish", label: "Finish" },
] as const;

const jadeTakes = sampleProfiles[0].takes;
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

function FillerClip({ take, target, label, playing, onPlay }: {
  take: Take;
  target: Filler | undefined;
  label: string;
  playing?: Take | FillerEvent;
  onPlay: (take: Take, event: FillerEvent) => void;
}) {
  const event = take.events?.find(({ text }) => text === target);
  if (!event) return null;

  return (
    <button className="secondary" aria-pressed={playing === event} onClick={() => onPlay(take, event)}>
      <span aria-hidden="true">▶</span> {label}
    </button>
  );
}

export function GuidedDemo() {
  const [index, setIndex] = useState(0);
  const { playing, playbackError, playClip, stopClip } = useTakePlayback();
  const screen = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const previousIndex = useRef(0);

  const step = steps[index];
  const [first, retry] = jadeTakes;
  const rule = chooseRule(first.events ?? []);
  const after = retry.events?.filter(({ text }) => text === rule?.target).length ?? 0;
  const counts = jadeTakes.map((take) => ({ seconds: take.seconds, fillerCount: pitchMetrics(take).fillers.length }));
  const earned = qualifiesForDailyChallenge(counts[1]) ? dailyChallenge.xp : 0;

  useEffect(() => {
    for (const { audio } of jadeTakes) {
      if (audio) void loadTakeAudio(audio).catch(() => undefined);
    }
    return stopSpeech;
  }, []);

  useEffect(() => {
    if (previousIndex.current === index) return;
    previousIndex.current = index;
    title.current?.focus({ preventScroll: true });
    screen.current?.scrollTo({ top: 0 });
  }, [index]);

  function move(next: number) {
    stopClip();
    stopSpeech();
    setIndex(next);
  }

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
                <p className="demo-copy">Jade built a tool for students who get nervous presenting. Follow her first SayLess session as she rehearses her project pitch.</p>
                <p className="demo-note">Fictional story with prerecorded audio.</p>
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

            {step.id === "practice" && (
              <>
                <h1 id="demo-title" ref={title} tabIndex={-1}>jade tries a pitch.</h1>
                <p className="demo-copy">{PITCH_PROMPT}</p>
                <div className="action-row">
                  <FillerClip take={first} target={rule?.target} label="Hear the first take’s filler" playing={playing} onPlay={(take, event) => void playClip(take, event)} />
                  <button className="demo-text-link" onClick={() => { stopClip(); speak(PITCH_PROMPT); }}>Hear the prompt</button>
                </div>
                <div className="demo-callout">
                  <p className="eyebrow">{rule ? `The coach heard “${rule.target}” ${rule.baselineCount} times` : "Coach’s cue"}</p>
                  <p>{first.suggestion}</p>
                </div>
              </>
            )}

            {step.id === "compare" && (
              <>
                <h1 id="demo-title" ref={title} tabIndex={-1}>hear what changed.</h1>
                {rule && (
                  <>
                    <p className="demo-count" aria-label={`${rule.target}, from ${rule.baselineCount} to ${after}`}><span>“{rule.target}”</span> {rule.baselineCount} → {after}</p>
                    <p className="demo-copy">Jade answered the same prompt again. Hear the moment in each take.</p>
                  </>
                )}
                <div className="action-row">
                  <FillerClip take={first} target={rule?.target} label="Hear first take" playing={playing} onPlay={(take, event) => void playClip(take, event)} />
                  <FillerClip take={retry} target={rule?.target} label="Hear retry" playing={playing} onPlay={(take, event) => void playClip(take, event)} />
                </div>
                <details className="demo-details">
                  <summary>See the transcripts</summary>
                  {jadeTakes.map((take, takeIndex) => {
                    const label = takeIndex === 0 ? "First take" : "Retry";
                    return (
                      <div className="demo-transcript" key={label}>
                        <p><strong>{label}</strong> · {take.seconds.toFixed(1)}s · {pitchMetrics(take).pace} words/min</p>
                        <p>“{take.transcript}”</p>
                        <button className="demo-text-link" aria-pressed={playing === take} onClick={() => void playClip(take)}>Play {label.toLowerCase()} in full</button>
                      </div>
                    );
                  })}
                </details>
              </>
            )}

            {step.id === "finish" && (
              <>
                <SayLessDot className="demo-celebration" mood="bright" color="mint" />
                <h1 id="demo-title" ref={title} tabIndex={-1}>one small win.</h1>
                <p className="demo-reward"><strong>+{earned}</strong> demo XP</p>
                <p className="demo-copy">Jade completed the clear-pitch challenge with {counts[1].fillerCount} filler sound in {retry.seconds.toFixed(1)}s.</p>
                <details className="demo-details">
                  <summary>See challenge details</summary>
                  <p>{dailyChallenge.prompt}</p>
                  <dl>
                    <div><dt>Filler Jar · both takes</dt><dd>{fillerJarCount(counts)}</dd></div>
                    <div><dt>Simulated duel points</dt><dd>{improvementScore(counts)}</dd></div>
                  </dl>
                </details>
              </>
            )}
            {playbackError && <p className="alert" role="alert">{playbackError}</p>}
          </div>
        </section>
      </main>
      <footer className="app-dock demo-controls">
        {step.id === "finish" ? (
          <>
            <Link href="/app#practice" className="primary">Try it with your voice <span aria-hidden="true">→</span></Link>
            <div className="demo-finish-links">
              <button className="demo-text-link" onClick={() => move(index - 1)}>Back</button>
              <button className="demo-text-link" onClick={() => move(0)}>Restart demo</button>
            </div>
          </>
        ) : (
          <>
            {index > 0 && <button className="demo-text-link" onClick={() => move(index - 1)}>Back</button>}
            <button className="primary" onClick={() => move(index + 1)}>{step.action} <span aria-hidden="true">→</span></button>
          </>
        )}
      </footer>
    </div>
  );
}
