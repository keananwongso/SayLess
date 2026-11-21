"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTakePlayback } from "@/components/use-take-playback";
import { dailyChallenge, fillerJarCount, improvementScore, qualifiesForDailyChallenge } from "@/lib/challenges";
import { chooseRule, pitchMetrics, PITCH_PROMPT, type Filler, type FillerEvent, type Take } from "@/lib/practice";
import { sampleProfiles } from "@/lib/sample-pitches";
import { speak, stopSpeech } from "@/lib/speech";
import { loadTakeAudio } from "@/lib/take-audio";
import { analyzeMessages, sampleMessages, type Message } from "@/lib/wrapped";

const steps = [
  { id: "setup", label: "Setup", action: "See Wrapped" },
  { id: "wrapped", label: "Wrapped", action: "Start practice" },
  { id: "practice", label: "Practice", action: "Hear the retry" },
  { id: "compare", label: "Compare", action: "Finish the challenge" },
  { id: "finish", label: "Finish" },
] as const;

const demoMessages: Message[] = [
  ...sampleMessages.filter(({ speaker }) => speaker === "Alex"),
  { speaker: "Sam", message: "Maybe try a shorter opener?" },
  { speaker: "Sam", message: "Maybe try a question instead. Sorry, I keep changing my mind." },
  { speaker: "Sam", message: "Maybe we should tell them who it helps first." },
  { speaker: "Sam", message: "Maybe try the clearer version. Thanks for listening!" },
];

const profiles = sampleProfiles.map((profile) => ({
  ...profile,
  wrapped: analyzeMessages(demoMessages, profile.name),
}));

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
  const [selected, setSelected] = useState(0);
  const { playing, playbackError, playClip, stopClip } = useTakePlayback();
  const title = useRef<HTMLHeadingElement>(null);
  const previousIndex = useRef(0);

  const step = steps[index];
  const profile = profiles[selected];
  const [first, retry] = profile.takes;
  const rule = chooseRule(first.events ?? []);
  const after = retry.events?.filter(({ text }) => text === rule?.target).length ?? 0;
  const counts = profile.takes.map((take) => ({ seconds: take.seconds, fillerCount: pitchMetrics(take).fillers.length }));
  const earned = qualifiesForDailyChallenge(counts[1]) ? dailyChallenge.xp : 0;

  useEffect(() => {
    for (const { takes } of profiles) {
      for (const { audio } of takes) {
        if (audio) void loadTakeAudio(audio).catch(() => undefined);
      }
    }
    return stopSpeech;
  }, []);

  useEffect(() => {
    if (previousIndex.current === index) return;
    previousIndex.current = index;
    title.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [index]);

  function move(next: number) {
    stopClip();
    stopSpeech();
    setIndex(next);
  }

  return (
    <div className="demo-onboarding" data-step={step.id}>
      <header className="demo-header">
        <Link href="/" className="wordmark"><span className="brand-mark" aria-hidden="true" />SayLess</Link>
        <Link href="/" className="demo-text-link">Exit demo</Link>
      </header>

      <main className="demo-shell">
        <div className="demo-progress">
          <p><strong>{step.label}</strong> · {index + 1} of {steps.length}</p>
          <progress aria-label="Demo progress" value={index + 1} max={steps.length} />
        </div>

        <section className="demo-card" aria-labelledby="demo-title">
          <div className="demo-content" key={step.id}>
            {step.id === "setup" && (
              <>
                <h1 id="demo-title" ref={title} tabIndex={-1}>let’s find your habits.</h1>
                <p className="demo-copy">Choose a sample speaker to see what shows up in their chats and how their pitch changes after one retry.</p>
                <div className="demo-options" role="group" aria-label="Sample speaker">
                  {profiles.map(({ name }, profileIndex) => (
                    <button className="demo-option" key={name} aria-pressed={selected === profileIndex} onClick={() => setSelected(profileIndex)}>
                      <span className="demo-choice-mark" aria-hidden="true" />
                      {name}
                    </button>
                  ))}
                </div>
                <p className="demo-note">Uses sample chats and prerecorded audio.</p>
              </>
            )}

            {step.id === "wrapped" && (
              <>
                <p className="demo-note">{profile.name}’s sample chat</p>
                <h1 id="demo-title" ref={title} tabIndex={-1}>your most repeated word.</h1>
                {profile.wrapped.word && (
                  <>
                    <p className="demo-reveal">“{profile.wrapped.word.text}”</p>
                    <p className="demo-copy"><strong>{profile.wrapped.word.count} times</strong> in {profile.wrapped.total} messages.</p>
                  </>
                )}
                <details className="demo-details">
                  <summary>See chat details</summary>
                  {profile.wrapped.phrase && <p>Signature phrase <strong>“{profile.wrapped.phrase.text}”</strong> · {profile.wrapped.phrase.count} times</p>}
                  <p>{profile.wrapped.profile.strengths[0]}</p>
                  <dl>
                    {profile.wrapped.habits.map(({ id, label, count }) => (
                      <div key={id}><dt>{label}</dt><dd>{count}</dd></div>
                    ))}
                  </dl>
                </details>
              </>
            )}

            {step.id === "practice" && (
              <>
                <h1 id="demo-title" ref={title} tabIndex={-1}>try a pitch.</h1>
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
                    <p className="demo-copy">Same speaker, same prompt. Hear the moment in each take.</p>
                  </>
                )}
                <div className="action-row">
                  <FillerClip take={first} target={rule?.target} label="Hear first take" playing={playing} onPlay={(take, event) => void playClip(take, event)} />
                  <FillerClip take={retry} target={rule?.target} label="Hear retry" playing={playing} onPlay={(take, event) => void playClip(take, event)} />
                </div>
                <details className="demo-details">
                  <summary>See the transcripts</summary>
                  {profile.takes.map((take, takeIndex) => {
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
                <h1 id="demo-title" ref={title} tabIndex={-1}>one small win.</h1>
                <p className="demo-count">+{earned} <span>demo XP</span></p>
                <p className="demo-copy">{profile.name} completed the clear-pitch challenge with {counts[1].fillerCount} filler sound in {retry.seconds.toFixed(1)}s.</p>
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

          <footer className="demo-controls">
            {index > 0 && <button className="demo-text-link" onClick={() => move(index - 1)}>Back</button>}
            {step.id === "finish" ? (
              <>
                <button className="demo-text-link" onClick={() => { setSelected(0); move(0); }}>Restart demo</button>
                <Link href="/#practice" className="primary">Try it with your voice <span aria-hidden="true">→</span></Link>
              </>
            ) : (
              <button className="primary" onClick={() => move(index + 1)}>{step.action} <span aria-hidden="true">→</span></button>
            )}
          </footer>
        </section>
      </main>
    </div>
  );
}
