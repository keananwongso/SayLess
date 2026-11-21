"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useTakePlayback } from "@/components/use-take-playback";
import { fillerCounts, MAX_AUDIO_BYTES, normalizeFiller, type RecordingAnalysis, type Take } from "@/lib/practice";
import { analyzeMessages } from "@/lib/wrapped";
import styles from "./analyze-recording.module.css";

type AnalysisResult = { report: RecordingAnalysis; recording: File };

function RecordingReport({ report, recording }: AnalysisResult) {
  const { playing, playbackError, playClip } = useTakePlayback();
  const { transcript, events, durationSeconds } = report;
  const text = analyzeMessages([{ speaker: "recording", message: transcript }], "recording");
  const recognizedFillers = events
    ? events.map(({ text }) => text)
    : (transcript.match(/\p{L}+(?:[’'-]\p{L}+)*/gu) ?? []).flatMap((word) => {
      const filler = normalizeFiller(word);
      return filler ? [filler] : [];
    });
  const breakdown = fillerCounts(recognizedFillers);
  const take = useMemo<Take>(() => ({ transcript, events, audio: recording, seconds: durationSeconds ?? 0, suggestion: "" }), [transcript, events, recording, durationSeconds]);
  const seconds = durationSeconds ? Math.round(durationSeconds) : undefined;
  const duration = seconds === undefined ? undefined : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <section className={`panel ${styles.report}`} aria-labelledby="recording-report">
      <div className="results-heading">
        <div>
          <p className="eyebrow">Whole recording · all speakers combined{duration ? ` · ${duration}` : ""}</p>
          <h2 id="recording-report">What came up</h2>
        </div>
        <button className="secondary" aria-pressed={playing === take} onClick={() => void playClip(take)}>Play recording</button>
      </div>

      <dl className={styles.metrics}>
        <div>
          <dt>{events ? "Detected filler sounds" : "Filler sounds in transcript"}</dt>
          <dd>{recognizedFillers.length}</dd>
          <dd className={styles.metricDetail}>“um” {breakdown.get("um") ?? 0} · “uh” {breakdown.get("uh") ?? 0}</dd>
        </div>
        <div>
          <dt>Most repeated word</dt>
          <dd>{text.word ? `“${text.word.text}”` : "None"}</dd>
          {text.word && <dd className={styles.metricDetail}>{text.word.count} times</dd>}
        </div>
        <div>
          <dt>Most repeated phrase</dt>
          <dd>{text.phrase ? `“${text.phrase.text}”` : "None"}</dd>
          {text.phrase && <dd className={styles.metricDetail}>{text.phrase.count} times</dd>}
        </div>
      </dl>

      {events?.length ? (
        <details>
          <summary>Hear the filler moments</summary>
          <div className="action-row filler-clips">
            {events.map((event, index) => (
              <button type="button" className="secondary" key={index} aria-pressed={event === playing} onClick={() => void playClip(take, event)}>
                “{event.text}” at {(event.startMs / 1000).toFixed(1)}s
              </button>
            ))}
          </div>
        </details>
      ) : events === undefined && <p className="muted">Timestamped clips are unavailable for this recording.</p>}

      <details><summary>Read the transcript</summary><p className={styles.transcript}>{transcript}</p></details>
      {playbackError && <p className="alert" role="alert">{playbackError}</p>}
    </section>
  );
}

export function AnalyzeRecording({ onPractice }: { onPractice: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const pending = useRef<AbortController>(null);
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<AnalysisResult>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => {
    pending.current?.abort();
    pending.current = null;
  }, []);

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;
    setError("");
    setResult(undefined);
    if (!selected.size || selected.size > MAX_AUDIO_BYTES) {
      setFile(undefined);
      setError("Choose a recording between 1 byte and 4 MB.");
      return;
    }
    setFile(selected);
  }

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    setBusy(true);
    setError("");
    setResult(undefined);

    const form = new FormData();
    form.set("audio", file);
    form.set("mode", "analysis");
    try {
      const response = await fetch("/api/practice", {
        method: "POST",
        body: form,
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(27_000)]),
      });
      const report = await response.json().catch(() => null) as (Partial<RecordingAnalysis> & { error?: string }) | null;
      if (controller.signal.aborted) return;
      if (!response.ok || !report?.transcript) {
        setError(report?.error ?? "Analysis is unavailable. Try again in a moment.");
        return;
      }
      setResult({ recording: file, report: { ...report, transcript: report.transcript } });
    } catch {
      if (!controller.signal.aborted) setError("Analysis couldn’t finish. Check your connection and try again.");
    } finally {
      if (pending.current === controller) {
        pending.current = null;
        setBusy(false);
      }
    }
  }

  return (
    <section className="flow" aria-labelledby="analyze-title">
      <div className={`hero ${styles.intro}`}>
        <h1 id="analyze-title" tabIndex={-1}>analyze a recording.</h1>
        <p className="lede">Upload a conversation or voice note to see repeated phrases, count fillers, and hear where they happened.</p>
        <form className={styles.form} onSubmit={analyze}>
          <input ref={input} hidden type="file" accept=".m4a,.mp4,.mp3,.wav,.webm,.ogg,.opus,audio/*" onChange={selectFile} />
          <div className="action-row">
            <button className="secondary" type="button" disabled={busy} onClick={() => input.current?.click()}>Choose recording</button>
            <button className="primary" type="submit" disabled={!file || busy}>{busy ? "Analyzing…" : "Analyze recording"}</button>
          </div>
          {file && <p className={styles.file}>{file.name}</p>}
          <p className="footnote muted">M4A, MP3, WAV, WebM, or Ogg up to 4 MB. Use audio you have permission to share for transcription.</p>
          {busy && <p className="footnote" role="status">Transcribing your recording and finding repeated words.</p>}
          {error && <p className="alert" role="alert">{error}</p>}
        </form>
        <button className={styles.textAction} onClick={onPractice}>Record a practice pitch</button>
      </div>
      {result && <RecordingReport {...result} />}
    </section>
  );
}
