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
import { analyzeMessages, sampleMessages } from "@/lib/wrapped";

const steps = [
  { id: "setup", label: "Meet Jade", action: "See Jade’s Yap Recap" },
  { id: "wrapped", label: "Yap Recap", action: "Start practice" },
  { id: "practice", label: "Practice", action: "Hear the retry" },
  { id: "compare", label: "Compare", action: "Finish the challenge" },
  { id: "finish", label: "Finish" },
] as const;

const jadeTakes = sampleProfiles[0].takes;
const jadeWrapped = analyzeMessages(sampleMessages, sampleProfiles[0].name);

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
                {jadeWrapped.word && (
                  <div className="demo-recap-insight">
                    <p>Jade’s most repeated word</p>
                    <p className="demo-recap-word">“{jadeWrapped.word.text}”</p>
                    <p><strong>{jadeWrapped.word.count} times</strong> in {jadeWrapped.total} messages</p>
                  </div>
                )}
                <details className="demo-details">
                  <summary>See chat details</summary>
                  {jadeWrapped.phrase && <p>Signature phrase <strong>“{jadeWrapped.phrase.text}”</strong> · {jadeWrapped.phrase.count} times</p>}
                  <p>{jadeWrapped.profile.strengths[0]}</p>
                  <dl>
                    {jadeWrapped.habits.map(({ id, label, count }) => (
                      <div key={id}><dt>{label}</dt><dd>{count}</dd></div>
                    ))}
                  </dl>
                </details>
              </div>
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
