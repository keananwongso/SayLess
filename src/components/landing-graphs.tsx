"use client";

import { useEffect, useState } from "react";
import { fillerEvents, landingSample, firstTotal, practiceGoal } from "@/lib/landing-sample";
import styles from "./landing-graphs.module.css";

const clock = (seconds: number) => `00:${seconds.toFixed(1).padStart(4, "0")}`;
const x = (seconds: number) => 24 + seconds / 60 * 912;

export function TranscriptGraph() {
  const [take, setTake] = useState<"first" | "retry">("first");
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pauses, setPauses] = useState(false);
  const [selected, setSelected] = useState(0);
  const events = fillerEvents[take];
  const event = events[selected];

  useEffect(() => {
    if (!playing) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = performance.now();
    const stop = () => setPlaying(false);
    const tick = (now: number) => {
      const elapsed = (now - previous) / 1000;
      previous = now;
      setTime(value => Math.min(60, value + elapsed));
      frame = requestAnimationFrame(tick);
    };
    // Explicit playback only; reduced-motion users can still seek by keyboard.
    if (!motion.matches) frame = requestAnimationFrame(tick);
    motion.addEventListener("change", stop);
    return () => { cancelAnimationFrame(frame); motion.removeEventListener("change", stop); };
  }, [playing]);

  useEffect(() => {
    if (time >= 60 && playing) {
      const id = requestAnimationFrame(() => setPlaying(false));
      return () => cancelAnimationFrame(id);
    }
  }, [time, playing]);

  function selectEvent(index: number) {
    setSelected(index); setTime(events[index].start); setPlaying(false);
  }

  return <div className={styles.waveCard}>
    <div className={styles.heading}>
      <div><h4>Make room for a pause.</h4><p>Every hesitation has a place on the timeline.</p></div>
      <div className={styles.switcher} role="group" aria-label="Transcript take">
        {(["first", "retry"] as const).map(value => <button key={value} type="button" aria-pressed={take === value} onClick={() => { setTake(value); setSelected(0); setTime(0); setPlaying(false); }}>{value === "first" ? "First take" : "Retry"}</button>)}
      </div>
    </div>
    <div className={styles.wavePanel}>
      <div className={styles.waveMeta}><span>{pauses ? "Proposed pauses" : `${events.length} filler moments`}</span><span>Illustrative waveform · 60s</span></div>
      <div className={styles.waveScroll} tabIndex={0} role="region" aria-label="Scrollable waveform; use the timestamp buttons below to select a filler">
        <svg className={styles.wave} viewBox="0 0 960 240" role="img" aria-label={`${take === "first" ? "First take" : "Retry"}: ${events.length} authored filler timestamps. ${pauses ? "Highlighted regions are proposed silent pauses." : "Highlighted regions mark um and uh."}`}>
          {Array.from({ length: 181 }, (_, i) => {
            const seconds = i / 3;
            const inEvent = events.some(item => seconds >= item.start && seconds <= item.end);
            const height = pauses && inEvent ? 2 : 8 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * .23)) * 80;
            return <line key={i} x1={x(seconds)} x2={x(seconds)} y1={120 - height / 2} y2={120 + height / 2} className={inEvent ? styles.accentBar : styles.waveBar} />;
          })}
          {events.map((item, index) => <g key={item.start} className={selected === index ? styles.selectedRegion : styles.region}>
            <rect x={x(item.start) - 3} y="65" width={Math.max(12, x(item.end) - x(item.start) + 6)} height="110" rx="3" />
            <path d={`M${x(item.start)} ${index % 2 ? 175 : 65} v${index % 2 ? 22 : -22}`} />
            <text x={Math.max(24, x(item.start) - 10)} y={index % 2 ? 216 : 30}>{pauses ? "pause" : item.word} · {item.start.toFixed(1)}s</text>
          </g>)}
          <line x1={x(time)} x2={x(time)} y1="50" y2="190" className={styles.playhead} />
        </svg>
        <div className={styles.ruler} aria-hidden="true">{[0, 10, 20, 30, 40, 50, 60].map(n => <span key={n}>{n}s</span>)}</div>
      </div>
      <label className={styles.seek}>Seek timeline <output>{clock(time)} / 01:00</output><input aria-label="Timeline position in seconds" type="range" min="0" max="60" step="0.1" value={time} onChange={e => { setTime(Number(e.target.value)); setPlaying(false); }} /></label>
    </div>
    <div className={styles.controls}>
      <button type="button" className={styles.animateButton} aria-pressed={playing} onClick={() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (time >= 60) setTime(0);
        setPlaying(value => !value);
      }}>{playing ? "Pause animation" : "Animate timeline"}</button>
      <button type="button" aria-pressed={pauses} onClick={() => setPauses(value => !value)}>{pauses ? "Show original fillers" : "Preview pauses"}</button>
      <span>Silent preview · no audio editing</span>
    </div>
    <div className={styles.timestamps} role="group" aria-label="Select a filler timestamp">
      {events.map((item, index) => <button key={item.start} type="button" aria-pressed={selected === index} aria-controls="filler-excerpt" onClick={() => selectEvent(index)}><strong>{item.word}</strong> {clock(item.start)}</button>)}
    </div>
    <div className={styles.excerpt} id="filler-excerpt" aria-live="polite">
      <span>{clock(event.start)}–{clock(event.end)} · {pauses ? "Suggested pause" : `“${event.word}”`}</span>
      <p>{landingSample[take][Math.floor(event.start / 10)].split(/(\b(?:um|uh)\b)/gi).map((part, index) => /^(um|uh)$/i.test(part) ? <mark key={index}>{pauses ? "[pause]" : part}</mark> : part)}</p>
    </div>
    <p className={styles.note}>Authored timestamps and waveform, not recorded audio. Pause preview keeps the same 60-second scale.</p>
  </div>;
}

export function PracticeProjection() {
  const [target, setTarget] = useState(75);
  const values = practiceGoal(target);
  const point = (value: number, week: number) => `${52 + week * 128},${208 - value * 20}`;
  return <div className={styles.goalCard}>
    <div className={styles.heading}><div><h4>A little practice. A direction to aim for.</h4><p>Set a four-week goal · fillers per minute</p></div><div className={styles.goalStat}><strong>{values[4]}</strong><span>goal / min</span></div></div>
    <div className={styles.switcher} role="group" aria-label="Choose illustrative reduction goal">
      {[25, 50, 75].map(value => <button type="button" key={value} aria-pressed={target === value} onClick={() => setTarget(value)}>{value}% fewer</button>)}
    </div>
    <div className={styles.goalScroll} tabIndex={0} role="region" aria-label="Scrollable practice goal chart">
    <svg className={styles.goalGraph} viewBox="0 0 600 256" role="img" aria-label={`Illustrative goal from ${firstTotal} to ${values[4]} fillers per minute over four weeks, not a prediction.`}>
      {[0, 2, 4, 6, 8].map(value => <g key={value}><line x1="52" x2="564" y1={208 - value * 20} y2={208 - value * 20} className={styles.gridLine} /><text x="22" y={213 - value * 20}>{value}</text></g>)}
      <path d="M52 48 H564" className={styles.baseline} />
      <polygon points={`52,208 ${values.map(point).join(" ")} 564,208`} className={styles.goalArea} />
      <polyline points={values.map(point).join(" ")} className={styles.goalLine} />
      {values.map((value, week) => <g key={week}><circle cx={52 + week * 128} cy={208 - value * 20} r="6" className={styles.goalPoint} /><text x={52 + week * 128} y="244" textAnchor="middle">{week ? `W${week}` : "Now"}</text></g>)}
    </svg>
    </div>
    <div className={styles.legend}><span>— Practice goal</span><span>┄ Starting rate: {firstTotal}/min</span></div>
    <details className={styles.values}><summary>Weekly goal values</summary><ul>{values.map((value, week) => <li key={week}>{week ? `Week ${week}` : "Starting point"}: {value} fillers/min</li>)}</ul></details>
    <p className={styles.note}>Illustrative goal, not a forecast. The line connects evenly spaced targets; it does not predict your learning rate or guarantee results.</p>
  </div>;
}
