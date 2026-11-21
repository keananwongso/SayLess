"use client";

import * as Select from "@radix-ui/react-select";
import { useRef, useState, useSyncExternalStore, type ChangeEvent } from "react";
import { analyzeMessages, habitRate, makeWrappedSnapshot, MAX_CSV_BYTES, parseMessages, sampleMessages, type WrappedSnapshot } from "@/lib/wrapped";

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
      <div className="spread">
        <div className="hero">
          <p className="eyebrow">Communication Wrapped</p>
          <h1 id="wrapped-title" tabIndex={-1}>Say less.<br /><em>Mean more.</em></h1>
          <p className="lede">See what you keep saying. Then practice saying what matters.</p>
          <button className="primary" onClick={onPractice}>Practice your pitch <span aria-hidden="true">↗</span></button>
        </div>
        <article className="wrapped-card" aria-labelledby="word-title">
          <div className="wrapped-copy">
            <h2 className="eyebrow" id="word-title">Most repeated word</h2>
            {insight.word ? (
              <>
                <p className={insight.word.text.length > 8 ? "feature-word feature-word-small" : "feature-word"}>
                  “{insight.word.text}”
                </p>
                <p><strong>{format(insight.word.count)} times</strong> in {messageCount}</p>
              </>
            ) : (
              <p className="empty-word">No standout word in {messageCount}.</p>
            )}
            <p className="card-source">{isSample ? "Sample chat" : "Imported chat"} · {speaker}</p>
          </div>
          <div className="sticker-stack" aria-hidden="true">
            <span className="sticker sticker-quote" />
            <span className="sticker sticker-pause" />
            <span className="sticker-spark" />
          </div>
        </article>
      </div>

      <div className="stat-grid">
        <article className="panel panel-lavender">
          <h2 className="eyebrow">Signature phrase</h2>
          {insight.phrase ? (
            <><p className="stat-value">“{insight.phrase.text}”</p><p>{format(insight.phrase.count)} appearances</p></>
          ) : <p>No repeated phrase found.</p>}
        </article>
        <article className="panel panel-melon">
          <h2 className="eyebrow">Messages with questions</h2>
          <p className="stat-value">{format(insight.questions)}</p>
          <p>{insight.questions ? "Curious or confused?" : "Keeping it declarative."}</p>
        </article>
      </div>

      <div className="profile-grid">
        <article className="panel communication-profile" aria-labelledby="profile-title">
          <div>
            <p className="eyebrow">Communication profile</p>
            <h2 id="profile-title">What this chat shows</h2>
          </div>
          <ul className="profile-list">
            {insight.profile.strengths.map((strength) => <li key={strength}>{strength}</li>)}
          </ul>
          <p className="profile-focus"><strong>Practice cue:</strong> {insight.profile.focus}</p>
        </article>

        <article className="panel habit-panel" aria-labelledby="habits-title">
          <div>
            <p className="eyebrow">Text habits</p>
            <h2 id="habits-title">Patterns worth noticing</h2>
          </div>
          <ul className="habit-list">
            {insight.habits.filter((habit) => habit.count > 0).map((habit) => (
              <li key={habit.id}>
                <strong>{habit.count} · {habit.label}</strong>
                <span>{habit.detail}</span>
              </li>
            ))}
            {!insight.habits.some((habit) => habit.count > 0) && <li>No repeated text pattern stands out in this sample yet.</li>}
          </ul>
          <p className="footnote">These are written-message patterns, not claims about how you speak.</p>
        </article>
      </div>

      <article className="progress-panel" aria-labelledby="progress-title">
        <div>
          <p className="eyebrow">Progress tracking</p>
          <h2 id="progress-title">Keep a private baseline.</h2>
          {previousSnapshot ? (
            <p>
              Filler-like wording is {fillerRate} per 100 words now, compared with {previousFillerRate} in your last saved snapshot.
            </p>
          ) : (
            <p>Save this analysis, then compare measurable text habits the next time you import a chat.</p>
          )}
        </div>
        <div className="progress-action">
          <p className="metric-pill">{fillerRate} filler-like words / 100</p>
          <button className="secondary" onClick={saveSnapshot}>Save private snapshot</button>
        </div>
        <p className="footnote">Snapshots store only counts, not your messages, and stay in this browser.</p>
      </article>

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
