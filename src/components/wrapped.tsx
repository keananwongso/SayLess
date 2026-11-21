"use client";

import * as Select from "@radix-ui/react-select";
import { useRef, useState, useSyncExternalStore, type ChangeEvent } from "react";
import { analyzeMessages, habitRate, makeWrappedSnapshot, MAX_CSV_BYTES, parseMessages, sampleMessages, type WrappedSnapshot } from "@/lib/wrapped";
import styles from "./wrapped.module.css";

const SNAPSHOT_STORAGE_KEY = "sayless-wrapped-snapshots-v1";
const SNAPSHOT_CHANGE_EVENT = "sayless-wrapped-snapshots-change";
const emptySnapshots: WrappedSnapshot[] = [];
let cachedSnapshotValue: string | null | undefined;
let cachedSnapshots: WrappedSnapshot[] = emptySnapshots;

function subscribeToSnapshots(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SNAPSHOT_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SNAPSHOT_CHANGE_EVENT, callback);
  };
}

function readSnapshots(): WrappedSnapshot[] {
  try {
    const stored = window.localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (stored === cachedSnapshotValue) return cachedSnapshots;
    cachedSnapshotValue = stored;
    if (!stored) {
      cachedSnapshots = emptySnapshots;
      return cachedSnapshots;
    }
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) {
      cachedSnapshots = emptySnapshots;
      return cachedSnapshots;
    }
    cachedSnapshots = parsed.filter((snapshot): snapshot is WrappedSnapshot => {
      if (!snapshot || typeof snapshot !== "object") return false;
      const candidate = snapshot as Partial<WrappedSnapshot>;
      return typeof candidate.capturedAt === "number"
        && typeof candidate.speaker === "string"
        && typeof candidate.messages === "number"
        && typeof candidate.words === "number"
        && typeof candidate.fillerLikeWords === "number"
        && typeof candidate.hedgePhrases === "number"
        && typeof candidate.apologies === "number";
    });
    return cachedSnapshots;
  } catch {
    cachedSnapshots = emptySnapshots;
    return cachedSnapshots;
  }
}

export function Wrapped({ onPractice }: { onPractice: () => void }) {
  const [messages, setMessages] = useState(sampleMessages);
  const [speaker, setSpeaker] = useState("Alex");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const snapshots = useSyncExternalStore(subscribeToSnapshots, readSnapshots, () => emptySnapshots);
  const fileInput = useRef<HTMLInputElement>(null);
  const isSample = messages === sampleMessages;
  const speakers = Array.from(new Set(messages.map((message) => message.speaker)));
  const insight = analyzeMessages(messages, speaker);
  const format = (count: number) => count.toLocaleString("en-US");
  const messageCount = `${format(insight.total)} ${insight.total === 1 ? "message" : "messages"}`;
  const speakerSnapshots = snapshots.filter((snapshot) => snapshot.speaker === speaker);
  const previousSnapshot = speakerSnapshots.at(-1);
  const fillerHabit = insight.habits.find((habit) => habit.id === "fillers");
  const fillerRate = habitRate(fillerHabit?.count ?? 0, insight.wordCount);
  const previousFillerRate = previousSnapshot ? habitRate(previousSnapshot.fillerLikeWords, previousSnapshot.words) : null;

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setLoading(true);
    try {
      if (file.size > MAX_CSV_BYTES) throw new Error("Choose a CSV under 1 MB.");
      const imported = parseMessages(await file.text());
      setMessages(imported);
      setSpeaker(imported[0].speaker);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "The CSV couldn't be read.");
    } finally {
      setLoading(false);
    }
  }

  function resetImport() {
    setMessages(sampleMessages);
    setSpeaker("Alex");
    setConsent(false);
    setError("");
  }

  function saveSnapshot() {
    const next = [...snapshots, makeWrappedSnapshot(insight, speaker)].slice(-12);
    window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(SNAPSHOT_CHANGE_EVENT));
  }

  return (
    <section aria-labelledby="wrapped-title" className="flow">
      <h1 id="wrapped-title" tabIndex={-1}>communication wrapped.</h1>
      <article className={styles.spotlight} aria-labelledby="word-title">
        <h2 id="word-title">Most repeated word</h2>
        {insight.word ? (
          <>
            <p className={styles.word}>“{insight.word.text}”</p>
            <p><strong>{format(insight.word.count)} times</strong> in {messageCount}</p>
          </>
        ) : (
          <p className={styles.empty}>No standout word in {messageCount}.</p>
        )}
        <p className={styles.source}>{isSample ? "Sample chat" : "Imported chat"} · {speaker}</p>
      </article>

      <dl className={styles.stats}>
        <div>
          <dt>Signature phrase</dt>
          <dd>{insight.phrase ? `“${insight.phrase.text}” · ${format(insight.phrase.count)}` : "None found"}</dd>
        </div>
        <div>
          <dt>Messages with questions</dt>
          <dd>{format(insight.questions)}</dd>
        </div>
      </dl>

      <button className="primary" onClick={onPractice}>Practice your pitch</button>

      <div className={styles.details}>
        <details>
          <summary>Communication profile</summary>
          <ul className="profile-list">
            {insight.profile.strengths.map((strength) => <li key={strength}>{strength}</li>)}
          </ul>
          <p><strong>Practice cue:</strong> {insight.profile.focus}</p>
        </details>
        <details>
          <summary>Text habits</summary>
          <ul className="habit-list">
            {insight.habits.filter((habit) => habit.count > 0).map((habit) => (
              <li key={habit.id}>
                <strong>{habit.count} · {habit.label}</strong>
                <span>{habit.detail}</span>
              </li>
            ))}
            {!insight.habits.some((habit) => habit.count > 0) && <li>No repeated text pattern stands out yet.</li>}
          </ul>
          <p className="footnote muted">These patterns come from written messages.</p>
        </details>
        <details>
          <summary>Private progress</summary>
          <p>
            {fillerRate} filler-like words per 100 words
            {previousSnapshot && ` · ${previousFillerRate} in the last snapshot`}.
          </p>
          <button className="secondary" onClick={saveSnapshot}>Save private snapshot</button>
          <p className="footnote muted">Only counts are saved in this browser.</p>
        </details>
      </div>

      <div className="dataset-controls">
        <div className="speaker-field">
          <span id="wrapped-speaker-label">Speaker</span>
          <Select.Root value={speaker} onValueChange={setSpeaker}>
            <Select.Trigger className="secondary speaker-trigger" aria-labelledby="wrapped-speaker-label">
              <Select.Value />
              <Select.Icon asChild><span className="control-chevron" aria-hidden="true" /></Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="speaker-menu" position="popper" align="start" sideOffset={6} collisionPadding={16}>
                <Select.Viewport className="speaker-options">
                  {speakers.map((name) => (
                    <Select.Item className="speaker-option" key={name} value={name}>
                      <Select.ItemText>{name}</Select.ItemText>
                      <Select.ItemIndicator className="speaker-check" aria-hidden="true">✓</Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        <details className="import">
          <summary className="secondary">
            Import chat CSV
            <span className="control-chevron" aria-hidden="true" />
          </summary>
          <p id="csv-help">Use a CSV with speaker and message columns. The chat stays in this tab.</p>
          <label className="consent">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            I have permission to use these messages.
          </label>
          <input hidden ref={fileInput} type="file" accept=".csv,text/csv" onChange={importFile} />
          <button className="secondary" aria-describedby="csv-help" disabled={!consent || loading} onClick={() => fileInput.current?.click()}>
            {loading ? "Reading CSV…" : "Choose CSV"}
          </button>
          {error && <p className="alert" role="alert">{error}</p>}
        </details>
        {!isSample && <button className="secondary" disabled={loading} onClick={resetImport}>Clear import</button>}
      </div>
    </section>
  );
}
