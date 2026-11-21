"use client";

import { useTakePlayback } from "@/components/use-take-playback";
import { fillerCounts, pitchMetrics, type FillerEvent, type PracticeSession, type Take } from "@/lib/practice";
import { speak } from "@/lib/speech";

function TakeCard({ take, label, baseline, onPlay, playing }: {
  take: Take;
  label: string;
  baseline?: boolean;
  onPlay: (event?: FillerEvent) => void;
  playing?: Take | FillerEvent;
}) {
  const { fillers, pace } = pitchMetrics(take);
  const breakdown = Array.from(fillerCounts(fillers), ([word, count]) => `${word} × ${count}`).join(" · ");
  const markers = take.audio ? take.events : undefined;

  return (
    <article className={baseline ? "panel take-card take-baseline" : "panel take-card"}>
      <h2 className="eyebrow">{label}</h2>
      <dl className="take-metrics">
        <div><dt>{take.events ? "Fillers" : "Text estimate"}</dt><dd>{fillers.length}</dd></div>
        <div><dt>Words / min</dt><dd>{pace}</dd></div>
        <div><dt>Time</dt><dd>{Math.round(take.seconds)}s</dd></div>
      </dl>
      {breakdown && <p className="footnote">{breakdown}</p>}
      <blockquote>“{take.transcript}”</blockquote>
      {markers?.length ? (
        <div className="action-row filler-clips" role="group" aria-label={`${label} filler clips`}>
          {markers.map((event, index) => (
            <button className="secondary" key={index} aria-pressed={event === playing} onClick={() => onPlay(event)}>
              <span aria-hidden="true">▶</span> “{event.text}” at {(event.startMs / 1000).toFixed(1)}s
            </button>
          ))}
        </div>
      ) : !markers && <p className="footnote muted">Timestamped replay is unavailable for this take.</p>}
      {take.audio && (
        <button className="secondary listen-take" aria-pressed={take === playing} onClick={() => onPlay()}>
          Listen to {label.toLowerCase()}
        </button>
      )}
    </article>
  );
}

type SampleSelection = { names: string[]; selected: number; onSelect: (index: number) => void };

export function Results({ session, onRetry, onRestart, sample }: {
  session: PracticeSession;
  onRetry: () => void;
  onRestart?: () => void;
  sample?: SampleSelection;
}) {
  const { takes: [first, retry], attempt, appliedRule, nextRule } = session;
  const current = retry ?? first;
  const after = appliedRule && retry?.events?.filter(({ text }) => text === appliedRule.target).length;
  const comparison = appliedRule && after !== undefined
    ? `“${appliedRule.target}” ${appliedRule.baselineCount} → ${after}`
    : undefined;
  const decreased = appliedRule && after !== undefined && after < appliedRule.baselineCount;
  const { playing, playbackError, playClip, stopClip } = useTakePlayback();

  return (
    <section className="flow" aria-labelledby="results-title">
      <div className="results-heading">
        <div>
          {sample && <p className="eyebrow sample-label">Sample replay</p>}
          <h1 id="results-title" tabIndex={-1}>{retry ? "Two takes." : "First take."}</h1>
        </div>
        {comparison && <p className={decreased ? "change change-positive" : "change"}>{comparison}</p>}
      </div>
      {sample && (
        <div className="action-row" role="group" aria-label="Sample speaker">
          {sample.names.map((name, index) => (
            <button className="secondary" key={name} aria-pressed={index === sample.selected} onClick={() => sample.onSelect(index)}>{name}</button>
          ))}
        </div>
      )}
      <div className="take-grid">
        <TakeCard take={first} label={attempt <= 2 ? "First take" : `Take ${attempt - 1}`} baseline onPlay={(event) => void playClip(first, event)} playing={playing} />
        {retry && <TakeCard take={retry} label={attempt === 2 ? "Retry" : `Take ${attempt}`} onPlay={(event) => void playClip(retry, event)} playing={playing} />}
      </div>
      {playbackError && <p className="alert" role="alert">{playbackError}</p>}
      <div className="coaching">
        <div>
          <h2 className="eyebrow">{nextRule ? `Next focus · “${nextRule.target}”` : "Coach’s suggestion"}</h2>
          <p>{current.suggestion}</p>
        </div>
        <button className="secondary" onClick={() => { stopClip(); speak(current.suggestion); }}>Hear feedback</button>
      </div>
      <div className="action-row">
        <button className="primary" onClick={onRetry}>{sample ? "Back to live practice" : "Try the same prompt again"}</button>
        {retry && onRestart && <button className="secondary" onClick={onRestart}>Start new comparison</button>}
      </div>
      <p className="footnote muted">Pace is estimated from transcript words and recording time.</p>
    </section>
  );
}
