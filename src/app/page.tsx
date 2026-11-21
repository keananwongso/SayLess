"use client";

import { useEffect, useRef, useState } from "react";
import { Practice } from "@/components/practice";
import { Results } from "@/components/results";
import { Wrapped } from "@/components/wrapped";
import { nextTake, type PracticeSession, type Take } from "@/lib/practice";
import { sampleProfiles } from "@/lib/sample-pitches";
import { loadTakeAudio } from "@/lib/take-audio";
import { stopSpeech } from "@/lib/speech";

type Step = "wrapped" | "practice" | "results" | "sample";

export default function Home() {
  const [step, setStep] = useState<Step>("wrapped");
  const [session, setSession] = useState<PracticeSession>();
  const [sampleIndex, setSampleIndex] = useState(0);
  const sample = sampleProfiles[sampleIndex];
  const main = useRef<HTMLElement>(null);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    main.current?.querySelector<HTMLElement>("div:not([hidden]) > section h1")?.focus();
  }, [step]);

  useEffect(() => {
    for (const profile of sampleProfiles) {
      for (const take of profile.takes) {
        if (take.audio) void loadTakeAudio(take.audio).catch(() => undefined);
      }
    }
  }, []);

  function go(next: Step) {
    stopSpeech();
    setStep(next);
  }

  function save(result: Take) {
    setSession((current) => nextTake(current, result));
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
            {session && <button aria-current={step === "results" ? "page" : undefined} onClick={() => go("results")}>Results</button>}
          </nav>
        </div>
      </header>
      <main className="shell" ref={main}>
        <div hidden={step !== "wrapped"}>
          <Wrapped onPractice={() => go("practice")} />
        </div>
        {step === "practice" && (
          <div>
            <Practice attempt={(session?.attempt ?? 0) + 1} rule={session?.nextRule} onResult={save} onSample={() => go("sample")} />
          </div>
        )}
        {step === "sample" && (
          <div>
            <Results
              key={sample.name}
              session={nextTake(nextTake(undefined, sample.takes[0]), sample.takes[1])}
              sample={{ names: sampleProfiles.map(({ name }) => name), selected: sampleIndex, onSelect: setSampleIndex }}
              onRetry={() => go("practice")}
            />
          </div>
        )}
        {step === "results" && session && (
          <div>
            <Results
              session={session}
              onRetry={() => go("practice")}
              onRestart={() => {
                setSession(undefined);
                go("practice");
              }}
            />
          </div>
        )}
      </main>
    </>
  );
}
