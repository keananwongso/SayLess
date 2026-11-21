"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTakePlayback } from "@/components/use-take-playback";
import { dailyChallenge, fillerJarCount, improvementScore, qualifiesForDailyChallenge } from "@/lib/challenges";
import { chooseRule, pitchMetrics, PITCH_PROMPT, type FillerEvent, type Take } from "@/lib/practice";
import { sampleProfiles } from "@/lib/sample-pitches";
import { speak, stopSpeech } from "@/lib/speech";
import { loadTakeAudio } from "@/lib/take-audio";
import { analyzeMessages, sampleMessages, type Message } from "@/lib/wrapped";

const stages = ["discover", "practice", "compare", "challenges"] as const;
type Stage = (typeof stages)[number];

const steps = [
  { id: "discover", label: "Discover" },
  { id: "practice", label: "Practice" },
  { id: "challenges", label: "Challenges" },
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

function TakePreview({ take, label, onPlay, playing }: {
  take: Take;
  label: string;
  onPlay: (event?: FillerEvent) => void;
  playing?: Take | FillerEvent;
}) {
  const { fillers, pace } = pitchMetrics(take);
  const marker = take.events?.[0];

  return (
    <article className="panel demo-take">
      <h2>{label}</h2>
      <dl className="demo-metrics">
        <div><dt>Fillers</dt><dd>{fillers.length}</dd></div>
        <div><dt>Words / min</dt><dd>{pace}</dd></div>
        <div><dt>Length</dt><dd>{take.seconds.toFixed(1)}s</dd></div>
      </dl>
      <blockquote>“{take.transcript}”</blockquote>
      <div className="action-row">
        <button className="secondary" aria-pressed={playing === take} onClick={() => onPlay()}>
          <span aria-hidden="true">▶</span> Play {label.toLowerCase()}
        </button>
        {marker && (
          <button className="secondary" aria-pressed={playing === marker} onClick={() => onPlay(marker)}>
            Hear “{marker.text}” at {(marker.startMs / 1000).toFixed(1)}s
          </button>
        )}
      </div>
    </article>
  );
}

export function GuidedDemo() {
  const [stage, setStage] = useState<Stage>("discover");
  const [selected, setSelected] = useState(0);
  const { playing, playbackError, playClip, stopClip } = useTakePlayback();
  const title = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef<Stage>("discover");
  const profile = profiles[selected];
  const [first, retry] = profile.takes;
  const rule = chooseRule(first.events ?? []);
  const counts = profile.takes.map((take) => ({ seconds: take.seconds, fillerCount: pitchMetrics(take).fillers.length }));
  const activeStep = stage === "compare" ? "practice" : stage;
  const after = retry.events?.filter(({ text }) => text === rule?.target).length ?? 0;
  const current = stages.indexOf(stage);
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
    if (previousStage.current === stage) return;
    previousStage.current = stage;
    title.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [stage]);

  function move(next: Stage) {
    stopClip();
    stopSpeech();
    setStage(next);
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="wordmark"><span className="brand-mark" aria-hidden="true" />SayLess</Link>
          <Link href="/" className="secondary">Open app <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      <main className="shell flow guided-demo">
        <div className="demo-topline">
          <ol className="demo-steps" aria-label="Demo progress">
            {steps.map(({ id, label }) => (
              <li key={id} aria-current={activeStep === id ? "step" : undefined}>{label}</li>
            ))}
          </ol>
          <p className="eyebrow sample-label">Guided demo · sample data</p>
        </div>

        {stage === "discover" && (
          <section className="flow" aria-labelledby="demo-title">
            <div className="spread">
              <div className="hero demo-intro">
                <p className="eyebrow">Communication Wrapped</p>
                <h1 id="demo-title" tabIndex={-1} ref={title}>Meet your habits.</h1>
                <p className="lede">Start with a sample chat. Then hear how the same speaker changes their pitch in two takes.</p>
                <div className="action-row" role="group" aria-label="Demo speaker">
                  {profiles.map(({ name }, index) => (
                    <button key={name} className="secondary" aria-pressed={index === selected} onClick={() => setSelected(index)}>
                      {name}
                    </button>
                  ))}
                </div>
                <button className="primary" onClick={() => move("practice")}>Start practice <span aria-hidden="true">→</span></button>
              </div>
              <article className="panel demo-reveal">
                <h2>{profile.name}’s most repeated word</h2>
                {profile.wrapped.word && (
                  <>
                    <p className="demo-big">“{profile.wrapped.word.text}”</p>
                    <p><strong>{profile.wrapped.word.count} times</strong> in {profile.wrapped.total} sample messages</p>
                  </>
                )}
                {profile.wrapped.phrase && (
                  <p className="demo-signature">Signature phrase <strong>“{profile.wrapped.phrase.text}”</strong> · {profile.wrapped.phrase.count} times</p>
                )}
              </article>
            </div>

            <div className="stat-grid">
              <article className="panel demo-profile">
                <h2>Chat profile</h2>
                <p>{profile.wrapped.profile.strengths[0]}</p>
                <p>{profile.wrapped.profile.focus}</p>
              </article>
              <article className="panel">
                <h2 className="eyebrow">Patterns in this chat</h2>
                <dl className="demo-habits">
                  {profile.wrapped.habits.map(({ id, label, count }) => (
                    <div key={id}><dt>{label}</dt><dd>{count}</dd></div>
                  ))}
                </dl>
              </article>
            </div>
          </section>
        )}

        {stage === "practice" && (
          <section className="flow" aria-labelledby="demo-title">
            <div className="spread">
              <div className="hero demo-intro">
                <p className="eyebrow">Conversation simulator · prerecorded example</p>
                <h1 id="demo-title" tabIndex={-1} ref={title}>Practice a project pitch.</h1>
                <p className="lede">The coach asks one question. Hear {profile.name}’s first take and the cue for the retry.</p>
              </div>
              <div className="panel practice-panel">
                <h2>Your coach asks</h2>
                <p className="prompt">{PITCH_PROMPT}</p>
                <button className="secondary" onClick={() => { stopClip(); speak(PITCH_PROMPT); }}>Hear prompt</button>
              </div>
            </div>
            <div className="stat-grid">
              <TakePreview take={first} label="First take" onPlay={(event) => void playClip(first, event)} playing={playing} />
              <article className="panel demo-profile">
                <h2>{rule ? `Next focus · “${rule.target}”` : "Coach’s suggestion"}</h2>
                {rule && <p>Heard <strong>{rule.baselineCount} instances</strong> in the recording.</p>}
                <p className="demo-cue">{first.suggestion}</p>
              </article>
            </div>
          </section>
        )}

        {stage === "compare" && (
          <section className="flow" aria-labelledby="demo-title">
            <div className="results-heading">
              <div>
                <p className="eyebrow">Same speaker · same prompt</p>
                <h1 id="demo-title" tabIndex={-1} ref={title}>Hear what changed.</h1>
              </div>
              {rule && <p className="change change-positive">“{rule.target}” {rule.baselineCount} → {after}</p>}
            </div>
            <div className="stat-grid">
              <TakePreview take={first} label="First take" onPlay={(event) => void playClip(first, event)} playing={playing} />
              <TakePreview take={retry} label="Retry" onPlay={(event) => void playClip(retry, event)} playing={playing} />
            </div>
            <div className="coaching">
              <div>
                <h2 className="eyebrow">Coach’s suggestion</h2>
                <p>{retry.suggestion}</p>
              </div>
            </div>
          </section>
        )}

        {stage === "challenges" && (
          <section className="flow" aria-labelledby="demo-title">
            <div className="results-heading">
              <div>
                <p className="eyebrow challenge-label">Challenges</p>
                <h1 id="demo-title" className="challenge-heading" tabIndex={-1} ref={title}>small reps.<br /><em>real momentum.</em></h1>
              </div>
            </div>
            <article className="daily-challenge">
              <div>
                <p className="eyebrow">Daily challenge · sample</p>
                <h2>{dailyChallenge.title}</h2>
                <p>{dailyChallenge.prompt}</p>
                <p className="footnote">{profile.name}’s retry used {counts[1].fillerCount} filler {counts[1].fillerCount === 1 ? "sound" : "sounds"} in {counts[1].seconds.toFixed(1)} seconds.</p>
              </div>
              {earned > 0 && <p className="complete-pill">Completed · +{earned} demo XP</p>}
            </article>
            <div className="stat-grid">
              <article className="panel demo-jar">
                <h2>Filler Jar</h2>
                <p className="stat-value">{fillerJarCount(counts)}</p>
                <p>Filler sounds across both practice takes.</p>
              </article>
              <article className="panel demo-profile">
                <h2>Friend duel · simulated</h2>
                <p className="stat-value">{improvementScore(counts)} points</p>
                <p>{profile.name} gains 20 points per fewer filler sound on the retry.</p>
              </article>
            </div>
          </section>
        )}

        {playbackError && <p className="alert" role="alert">{playbackError}</p>}
        {current > 0 && (
          <div className="action-row demo-actions">
            <button className="secondary" onClick={() => move(stages[current - 1])}>Back</button>
            {stage === "practice" && <button className="primary" onClick={() => move("compare")}>Compare the retry <span aria-hidden="true">→</span></button>}
            {stage === "compare" && <button className="primary" onClick={() => move("challenges")}>See the challenge <span aria-hidden="true">→</span></button>}
            {stage === "challenges" && <button className="primary" onClick={() => { setSelected(0); move("discover"); }}>Restart demo</button>}
          </div>
        )}
      </main>
    </>
  );
}
