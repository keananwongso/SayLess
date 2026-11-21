"use client";

import { useEffect, useRef, useState } from "react";
import { Practice } from "@/components/practice";
import { Results } from "@/components/results";
import { Wrapped } from "@/components/wrapped";
import type { Take } from "@/lib/practice";
import { samplePitches } from "@/lib/sample-pitches";
import { stopSpeech } from "@/lib/speech";

type Step = "wrapped" | "practice" | "results" | "sample";

export default function Home() {
  const [step, setStep] = useState<Step>("wrapped");
  const [takes, setTakes] = useState<[Take, Take?]>();
  const main = useRef<HTMLElement>(null);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    main.current?.querySelector<HTMLElement>("div:not([hidden]) > section h1")?.focus();
  }, [step]);

  function go(next: Step) {
    stopSpeech();
    setStep(next);
  }

  function save(result: Take) {
    setTakes((current) => current ? [current[0], result] : [result]);
    setStep("results");
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <button className="wordmark" onClick={() => go("wrapped")}>
            <span className="brand-mark" aria-hidden="true" />
            SayLess
          </button>
          <nav aria-label="SayLess">
            <button aria-current={step === "wrapped" ? "page" : undefined} onClick={() => go("wrapped")}>
              Wrapped
            </button>
            <button aria-current={step === "practice" || step === "sample" ? "page" : undefined} onClick={() => go("practice")}>
              Practice
            </button>
            {takes && <button aria-current={step === "results" ? "page" : undefined} onClick={() => go("results")}>Results</button>}
          </nav>
        </div>
      </header>
      <main className="shell" ref={main}>
        <div hidden={step !== "wrapped"}>
          <Wrapped onPractice={() => go("practice")} />
        </div>
        {step === "practice" && (
          <div><Practice attempt={takes ? 2 : 1} onResult={save} onSample={() => go("sample")} /></div>
        )}
        {step === "sample" && (
          <div>
            <Results sample takes={samplePitches} onRetry={() => go("practice")} onRestart={() => go("practice")} />
          </div>
        )}
        {step === "results" && takes && (
          <div>
            <Results
              takes={takes}
              onRetry={() => go("practice")}
              onRestart={() => {
                setTakes(undefined);
                go("practice");
              }}
            />
          </div>
        )}
      </main>
    </>
  );
}
