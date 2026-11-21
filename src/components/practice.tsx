"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_AUDIO_BYTES, MAX_RECORDING_SECONDS, PITCH_PROMPT, type Feedback, type Take } from "@/lib/practice";
import { speak, stopSpeech } from "@/lib/speech";

type Status = "idle" | "permission" | "recording" | "processing";

type Recording = {
  controller: AbortController;
  stream?: MediaStream;
  recorder?: MediaRecorder;
  timer?: number;
};

function stopTracks(stream?: MediaStream) {
  stream?.getTracks().forEach((track) => track.stop());
}

function release(recording: Recording) {
  window.clearInterval(recording.timer);
  stopTracks(recording.stream);
}

const formats = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"];

function recordingError(error: unknown) {
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "Microphone access was denied. Allow it in your browser or watch the sample.";
  }
  if (error instanceof DOMException && error.name === "NotFoundError") {
    return "No microphone was found. Connect one or watch the sample.";
  }
  return error instanceof Error ? error.message : "The recording didn't finish.";
}

export function Practice({ attempt, onResult, onSample }: {
  attempt: number;
  onResult: (take: Take) => void;
  onSample: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const active = useRef<Recording>(null);

  useEffect(() => () => {
    const recording = active.current;
    if (recording) {
      recording.controller.abort();
      release(recording);
    }
  }, []);

  async function startRecording() {
    if (active.current) return;
    setError("");
    setElapsed(0);
    stopSpeech();
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Microphone recording needs a supported browser and a secure connection.");
      return;
    }

    const recording: Recording = { controller: new AbortController() };
    active.current = recording;
    const signal = recording.controller.signal;
    setStatus("permission");

    function reset(message: string) {
      if (signal.aborted) return;
      release(recording);
      recording.controller.abort();
      active.current = null;
      setStatus("idle");
      setError(message);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (signal.aborted) {
        stopTracks(stream);
        return;
      }
      recording.stream = stream;
      const mimeType = formats.find((format) => MediaRecorder.isTypeSupported(format));
      const recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 64_000 });
      recording.recorder = recorder;
      const chunks: Blob[] = [];
      const startedAt = performance.now();
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onerror = () => reset("The microphone stopped recording. Try again or watch the sample.");
      recorder.onstop = async () => {
        release(recording);
        if (signal.aborted) return;
        const seconds = (performance.now() - startedAt) / 1000;
        const audio = new Blob(chunks, { type: recorder.mimeType });
        if (seconds < 1 || audio.size === 0) {
          reset("Record at least one second of audio.");
          return;
        }
        if (audio.size > MAX_AUDIO_BYTES) {
          reset("The recording is too large. Try a shorter take.");
          return;
        }
        setStatus("processing");

        const form = new FormData();
        form.set("audio", audio);
        try {
          const response = await fetch("/api/practice", {
            method: "POST",
            body: form,
            signal: AbortSignal.any([signal, AbortSignal.timeout(24_000)]),
          });
          const data = (await response.json()) as Partial<Feedback> & { error?: string };
          if (!response.ok || !data.transcript || !data.suggestion) {
            throw new Error(data.error ?? "Live coaching is unavailable. Try again or watch the sample.");
          }
          if (signal.aborted) return;
          active.current = null;
          speak(data.suggestion);
          onResult({ transcript: data.transcript, suggestion: data.suggestion, seconds });
        } catch (failure) {
          reset(failure instanceof Error && failure.name !== "TimeoutError"
            ? recordingError(failure)
            : "Live coaching timed out. Try again or watch the sample.");
        }
      };
      recorder.start();
      setStatus("recording");

      recording.timer = window.setInterval(() => {
        const seconds = (performance.now() - startedAt) / 1000;
        setElapsed(Math.min(Math.floor(seconds), MAX_RECORDING_SECONDS));
        if (seconds >= MAX_RECORDING_SECONDS && recorder.state === "recording") recorder.stop();
      }, 100);
    } catch (failure) {
      reset(recordingError(failure));
    }
  }

  function stopRecording() {
    const recorder = active.current?.recorder;
    if (recorder?.state === "recording") recorder.stop();
  }

  return (
    <section aria-labelledby="practice-title" className="flow">
      <div className="spread">
        <div className="hero">
          <p className="eyebrow">Pitch practice · Take {attempt}</p>
          <h1 id="practice-title" tabIndex={-1}>Make your<br /><em>point.</em></h1>
          <p className="lede">Give yourself about 10 seconds to pitch your project.</p>
        </div>
        <div className="panel practice-panel">
          <p className="eyebrow">Your coach asks</p>
          <p className="prompt">{PITCH_PROMPT}</p>
          <button className="secondary" disabled={status !== "idle"} onClick={() => speak(PITCH_PROMPT)}>Hear prompt</button>
          <div className="record-controls">
            {status === "recording" ? (
              <button className="primary" onClick={stopRecording}><span className="record-dot" aria-hidden="true" />Stop &amp; get feedback</button>
            ) : (
              <button className="primary" disabled={status !== "idle"} onClick={startRecording}>
                <span className="record-dot" aria-hidden="true" />
                {status === "permission" ? "Waiting for microphone…" : status === "processing" ? "Coach is listening back…" : "Start recording"}
              </button>
            )}
            {status === "recording" && <span className="rec-timer" aria-label="Seconds recorded">0:{String(elapsed).padStart(2, "0")}</span>}
          </div>
          {error && <p className="alert" role="alert">{error}</p>}
          <p className="footnote" role="status">
            {status === "processing" ? "Transcribing your pitch and finding one improvement." : "Your recording is sent to OpenAI for feedback."}
          </p>
        </div>
      </div>
      <div className="action-row">
        <button className="secondary" onClick={onSample}>Watch sample replay</button>
      </div>
    </section>
  );
}
