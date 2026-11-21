"use client";

import { useEffect, useRef, useState } from "react";
import { fillerEvents, landingSample, practiceJourney, reductionPercent, firstTotal, retryTotal } from "@/lib/landing-sample";
import styles from "./landing-graphs.module.css";

const clock = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toFixed(1).padStart(4, "0")}`;

export function TranscriptGraph() {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const complete = time >= 60;
  const visibleTime = reduced ? 60 : time;
  const segment = Math.min(5, Math.floor(visibleTime / 10));
  const events = fillerEvents.first;
  const segmentEvents = events.filter(event => Math.floor(event.start / 10) === segment);
  let wordIndex = 0;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduced || complete) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    if (root.current) observer.observe(root.current);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden) setTime(value => Math.min(60, value + .3));
    }, 100);
    return () => { clearInterval(timer); observer.disconnect(); };
  }, [paused, reduced, complete]);

  return <div ref={root} className={styles.waveCard}>
    <div className={styles.heading}><h3>Catch the little words.</h3><span>60s take · silent 3× preview</span></div>
    <div className={styles.wavePanel}>
      <div className={styles.waveBars} role="img" aria-label="Illustrative waveform fills as the example plays. Highlighted transcript words include their authored timestamps.">
        {Array.from({ length: 80 }, (_, index) => {
          const seconds = index * .75;
          const filler = events.some(item => seconds >= item.start - .3 && seconds <= item.end);
          const height = 12 + Math.abs(Math.sin(index * 1.7) * Math.cos(index * .23)) * 76;
          return <span key={index} data-filled={seconds <= visibleTime} data-filler={filler} style={{ height: `${height}%` }} />;
        })}
      </div>
      <div className={styles.ruler} aria-hidden="true"><span>0s</span><span>15s</span><span>30s</span><span>45s</span><span>60s</span></div>
    </div>
    <p className={styles.excerpt} key={segment}>{landingSample.first[segment].split(/(\b(?:um|uh|like|wait|well)\b[,!.?]?)/gi).map((part, index) => {
      if (!/^(um|uh|like|wait|well)[,!.?]?$/i.test(part)) return part;
      const event = segmentEvents[wordIndex++];
      return <span className={styles.timedWord} data-reached={visibleTime >= event.start} key={index}><mark>{part}</mark><small>{clock(event.start)}</small></span>;
    })}</p>
    {!reduced && <button className={styles.pauseButton} type="button" aria-pressed={paused} onClick={() => {
      if (complete) { setTime(0); setPaused(false); } else setPaused(value => !value);
    }}>{complete ? "Replay" : paused ? "Resume" : "Pause"}</button>}
  </div>;
}

function JourneyChart({ compact }: { compact: boolean }) {
  const values = practiceJourney(75);
  const width = compact ? 340 : 720;
  const height = compact ? 224 : 236;
  const left = 30;
  const right = width - 24;
  const bottom = height - 32;
  const px = (index: number) => left + index / 12 * (right - left);
  const py = (value: number) => bottom - value / 8 * (bottom - 48);
  const points = values.map((value, index) => `${px(index)},${py(value)}`);
  return <svg className={compact ? styles.mobileChart : styles.desktopChart} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Illustrative four-week path: 8 fillers per minute at the start, 6.4 after example practice, and a projected goal of 2. Not a prediction.">
    {[0, 4, 8].map(value => <g key={value}><line x1={left} x2={right} y1={py(value)} y2={py(value)} className={styles.gridLine} /><text x="6" y={py(value) + 5}>{value}</text></g>)}
    <g className={styles.chartReveal}>
      <polygon points={`${left},${bottom} ${points.join(" ")} ${right},${bottom}`} className={styles.goalArea} />
      <polyline points={points.slice(0, 5).join(" ")} className={styles.goalLine} />
      <polyline points={points.slice(4).join(" ")} className={styles.projectedLine} />
      {values.map((value, index) => <circle key={index} cx={px(index)} cy={py(value)} r={[0,4,12].includes(index) ? 4 : 2.5} className={index > 4 ? styles.projectedPoint : styles.goalPoint} />)}
    </g>
    <g className={styles.annotations}><text x={left} y={py(8) - 16}>First take</text><text x={px(4)} y={py(values[4]) - 16} textAnchor="middle">Reset</text><text x={right} y={py(2) - 16} textAnchor="end">Goal: 2</text></g>
    {[0, 3, 6, 9, 12].map((index, week) => <text key={index} x={px(index)} y={height - 8} textAnchor={index === 0 ? "start" : index === 12 ? "end" : "middle"}>{week ? `W${week}` : "Start"}</text>)}
  </svg>;
}

export function PracticeProjection() {
  return <div className={styles.goalCard}>
    <div className={styles.heading}><h3>A little progress, over time.</h3><span className={styles.stat} title={`(${firstTotal} − ${retryTotal}) ÷ ${firstTotal} × 100; synthetic one-minute takes, not measured user results.`}>{reductionPercent}% fewer in sample</span></div>
    <div className={styles.legend}><span>Example takes</span><span>Illustrative goal · fillers/min</span></div>
    <JourneyChart compact={false} /><JourneyChart compact />
  </div>;
}
