"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { analyzeMessages, MAX_CSV_BYTES, parseMessages, sampleMessages } from "@/lib/wrapped";

export function Wrapped({ onPractice }: { onPractice: () => void }) {
  const [messages, setMessages] = useState(sampleMessages);
  const [speaker, setSpeaker] = useState("Alex");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const isSample = messages === sampleMessages;
  const speakers = Array.from(new Set(messages.map((message) => message.speaker)));
  const insight = analyzeMessages(messages, speaker);
  const format = (count: number) => count.toLocaleString("en-US");
  const messageCount = `${format(insight.total)} ${insight.total === 1 ? "message" : "messages"}`;

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
          <p className="eyebrow" id="word-title">Most repeated word</p>
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
        </article>
      </div>

      <div className="stat-grid">
        <article className="panel">
          <h2 className="eyebrow">Signature phrase</h2>
          {insight.phrase ? (
            <><p className="stat-value">“{insight.phrase.text}”</p><p>{format(insight.phrase.count)} appearances</p></>
          ) : <p>No repeated phrase found.</p>}
        </article>
        <article className="panel">
          <h2 className="eyebrow">Messages with questions</h2>
          <p className="stat-value">{format(insight.questions)}</p>
          <p>{insight.questions ? "Curious or confused?" : "Keeping it declarative."}</p>
        </article>
      </div>

      <div className="dataset-controls">
        <label className="speaker-field">
          Speaker
          <select value={speaker} onChange={(event) => setSpeaker(event.target.value)}>
            {speakers.map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
        <details className="import">
          <summary>Import chat CSV</summary>
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
