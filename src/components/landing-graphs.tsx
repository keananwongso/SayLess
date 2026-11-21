"use client";

import { useEffect, useRef, useState } from "react";
import { fillerEvents, landingSample, practiceJourney } from "@/lib/landing-sample";
import styles from "./landing-graphs.module.css";

const clock = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toFixed(1).padStart(4, "0")}`;

export function TranscriptGraph() {
  const [take, setTake] = useState<"first" | "retry">("first");
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [pauses, setPauses] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const events = fillerEvents[take];
  const visibleTime = reduced ? 60 : time;
  const found = events.filter(event => event.start <= visibleTime);
  const event = found.at(-1);
  const segment = Math.min(5, Math.floor(visibleTime / 10));

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    if (root.current) observer.observe(root.current);
    // 60 illustrative seconds fill in over 20 real seconds, then hold before looping.
    const timer = window.setInterval(() => {
      if (visible && !document.hidden) setTime(value => value >= 66 ? 0 : value + .3);
    }, 100);
    return () => { clearInterval(timer); observer.disconnect(); };
  }, [paused, reduced]);

  return <div ref={root} className={styles.waveCard}>
    <div className={styles.heading}>
      <h3>Catch the little words.</h3>
      <div className={styles.switcher} role="group" aria-label="Transcript take">
        {(["first", "retry"] as const).map(value => <button key={value} type="button" aria-pressed={take === value} onClick={() => { setTake(value); setTime(0); }}>{value === "first" ? "First take" : "Retry"}</button>)}
      </div>
    </div>
    <div className={styles.wavePanel}>
      <div className={styles.waveMeta}><span>{found.length} / {events.length} moments noticed</span><span>{clock(Math.min(60, visibleTime))} · 3× preview</span></div>
      <div className={styles.waveBars} role="img" aria-label="Illustrative waveform fills automatically as hesitation words appear. Exact example timestamps are listed below.">
        {Array.from({ length: 100 }, (_, index) => {
          const seconds = index * .6;
          const filler = events.some(item => seconds >= item.start - .3 && seconds <= item.end);
          const height = pauses && filler ? 4 : 12 + Math.abs(Math.sin(index * 1.7) * Math.cos(index * .23)) * 76;
          return <span key={index} data-filled={seconds <= visibleTime} data-filler={filler} style={{ height: `${height}%` }} />;
        })}
      </div>
      <div className={styles.ruler} aria-hidden="true"><span>0s</span><span>15s</span><span>30s</span><span>45s</span><span>60s</span></div>
      <div className={styles.currentWord}>
        <strong>{event ? (pauses ? "A little pause" : `“${event.word}”`) : "Your idea, taking shape."}</strong>
        <span>{event ? `${clock(event.start)}–${clock(event.end)}` : "Watching the example…"}</span>
      </div>
    </div>
    <div className={styles.controls}>
      {!reduced && <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Resume" : "Pause"}</button>}
      <button type="button" aria-pressed={pauses} onClick={() => setPauses(value => !value)}>{pauses ? "Show words" : "Try pauses"}</button>
      <span>Silent, illustrative sample</span>
    </div>
    <p className={styles.excerpt}>{landingSample[take][segment].split(/(\b(?:um|uh|like|wait|well)\b)/gi).map((part, index) => /^(um|uh|like|wait|well)$/i.test(part) ? <mark key={index}>{pauses ? "[pause]" : part}</mark> : part)}</p>
    <details className={styles.values}><summary>All example timestamps</summary><ul>{events.map(item => <li key={item.start}>{item.word} · {clock(item.start)}–{clock(item.end)}</li>)}</ul></details>
  </div>;
}

export function PracticeProjection() {
  const [target, setTarget] = useState(75);
  const [checkpoint, setCheckpoint] = useState(4);
  const values = practiceJourney(target);
  const px = (index: number) => 44 + index * 42;
  const py = (value: number) => 210 - value * 19;
  const points = values.map((value, index) => `${px(index)},${py(value)}`);
  return <div className={styles.goalCard}>
    <div className={styles.heading}><h3>A little progress, over time.</h3><span className={styles.goalStat}>{values.at(-1)}/min goal</span></div>
    <div className={styles.goalScroll} tabIndex={0} role="region" aria-label="Scrollable example progress chart">
      <svg className={styles.goalGraph} viewBox="0 0 600 260" role="img" aria-label={`Illustrative progress with 13 checkpoints, plateaus and setbacks. Five synthetic sample points followed by eight projected goal points, ending at ${values.at(-1)} fillers per minute.`}>
        <rect x={px(4)} y="24" width={px(12) - px(4)} height="186" rx="12" className={styles.projectedZone} />
        {[0, 2, 4, 6, 8].map(value => <g key={value}><line x1="44" x2="548" y1={py(value)} y2={py(value)} className={styles.gridLine} /><text x="14" y={py(value) + 6}>{value}</text></g>)}
        <text x="54" y="28">Example takes</text><text x="330" y="28">Illustrative projection</text>
        <polygon points={`44,210 ${points.join(" ")} 548,210`} className={styles.goalArea} />
        <polyline points={points.slice(0, 5).join(" ")} className={styles.goalLine} />
        <polyline points={points.slice(4).join(" ")} className={styles.projectedLine} />
        <line x1={px(checkpoint)} x2={px(checkpoint)} y1="42" y2="210" className={styles.checkpointLine} />
        {values.map((value, index) => <circle key={index} cx={px(index)} cy={py(value)} r={checkpoint === index ? 8 : 5} className={index > 4 ? styles.projectedPoint : styles.goalPoint} />)}
        {[0, 3, 6, 9, 12].map((index, week) => <text key={index} x={px(index)} y="246" textAnchor="middle">{week ? `W${week}` : "Start"}</text>)}
      </svg>
    </div>
    <details className={styles.values}><summary>Explore checkpoints &amp; goals</summary>
    <div className={styles.switcher} role="group" aria-label="Choose illustrative reduction goal">{[25, 50, 75].map(value => <button type="button" key={value} aria-pressed={target === value} onClick={() => setTarget(value)}>{value}% fewer</button>)}</div>
    <div className={styles.checkpointSummary} aria-live="polite"><strong>{values[checkpoint]} fillers/min</strong><span>{checkpoint > 4 ? "Projected checkpoint" : "Synthetic example take"} {checkpoint + 1}</span></div>
    <div className={styles.checkpoints} role="group" aria-label="Inspect progress checkpoints">{values.map((value, index) => <button key={index} type="button" aria-pressed={checkpoint === index} aria-label={`${index > 4 ? "Projected checkpoint" : "Example take"} ${index + 1}: ${value} fillers per minute`} onClick={() => setCheckpoint(index)}>{index + 1}</button>)}</div>
    </details>
    <p className={styles.note}>Synthetic examples &amp; illustrative goals—not a forecast.</p>
  </div>;
}
