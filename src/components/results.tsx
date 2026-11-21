"use client";

import { pitchMetrics, type Take } from "@/lib/practice";
import { speak } from "@/lib/speech";

function TakeCard({ take, label }: { take: Take; label: string }) {
  const { fillers, pace } = pitchMetrics(take);
  const fillerBreakdown = Array.from(new Set(fillers)).map((word) => {
    const count = fillers.filter((filler) => filler === word).length;
    return `${word} × ${count}`;
  }).join(" · ");

  return (
    <article className="panel take-card">
      <h2 className="eyebrow">{label}</h2>
      <dl className="take-metrics">
        <div><dt>Fillers</dt><dd>{fillers.length}</dd></div>
        <div><dt>Words / min</dt><dd>{pace}</dd></div>
        <div><dt>Time</dt><dd>{Math.round(take.seconds)}s</dd></div>
      </dl>
      {fillerBreakdown && <p className="footnote">{fillerBreakdown}</p>}
      <blockquote>“{take.transcript}”</blockquote>
    </article>
  );
}

export function Results({
  takes,
  onRetry,
  onRestart,
}: {
  takes: [Take, Take?];
  onRetry: () => void;
  onRestart: () => void;
}) {
  const [first, retry] = takes;
  const current = retry ?? first;
  const delta = retry ? pitchMetrics(retry).fillers.length - pitchMetrics(first).fillers.length : 0;
  const change = delta === 0
    ? "Same filler count."
    : `${Math.abs(delta)} ${delta < 0 ? "fewer" : "more"} ${Math.abs(delta) === 1 ? "filler" : "fillers"}.`;

  return (
    <section className="flow" aria-labelledby="results-title">
      <div className="results-heading">
        <div>
          <p className="eyebrow">{retry ? "Side by side" : "Take 1 complete"}</p>
          <h1 id="results-title" tabIndex={-1}>{retry ? "Two takes." : "First take."}</h1>
        </div>
        {retry && <p className="change">{change}</p>}
      </div>
      <div className={retry ? "stat-grid take-grid" : "take-grid"}>
        <TakeCard take={first} label="First take" />
        {retry && <TakeCard take={retry} label="Retry" />}
      </div>
      <div className="coaching">
        <div>
          <h2 className="eyebrow">Coach’s suggestion</h2>
          <p>{current.suggestion}</p>
        </div>
        <button className="secondary" onClick={() => speak(current.suggestion)}>Hear feedback</button>
      </div>
      <div className="action-row">
        {retry ? (
          <button className="primary" onClick={onRestart}>Start new comparison</button>
        ) : (
          <button className="primary" onClick={onRetry}>Try the same prompt again <span aria-hidden="true">↗</span></button>
        )}
      </div>
      <p className="footnote muted">Pace is estimated from transcript words and recording time. Filler counts track sounds like “um” and “uh.”</p>
    </section>
  );
}
