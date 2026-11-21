"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnalyzeRecording } from "@/components/analyze-recording";
import { Challenges } from "@/components/challenges";
import { Profile } from "@/components/profile";
import { Practice } from "@/components/practice";
import { Results } from "@/components/results";
import { Wrapped } from "@/components/wrapped";
import { WorkspaceNav } from "@/components/workspace-nav";
import type { ChallengeTake } from "@/lib/challenges";
import { nextTake, pitchMetrics, type PracticeSession, type Take } from "@/lib/practice";
import { sampleProfiles } from "@/lib/sample-pitches";
import { loadTakeAudio } from "@/lib/take-audio";
import { stopSpeech } from "@/lib/speech";

type Step = "analyze" | "wrapped" | "practice" | "results" | "sample" | "challenges" | "profile";

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function currentHash() {
  return window.location.hash;
}

export default function Workspace() {
  const hash = useSyncExternalStore(subscribeToHash, currentHash, () => "");
  const [selectedStep, setStep] = useState<Step>();
  const step = selectedStep ?? (hash === "#practice" ? "practice" : hash === "#wrapped" ? "wrapped" : "analyze");
  const [session, setSession] = useState<PracticeSession>();
  const [practiceHistory, setPracticeHistory] = useState<ChallengeTake[]>([]);
  const [sampleIndex, setSampleIndex] = useState(0);
  const sample = sampleProfiles[sampleIndex];
  const main = useRef<HTMLElement>(null);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    main.current?.scrollTo({ top: 0 });
    main.current?.querySelector<HTMLElement>(":scope > section h1, :scope > div:not([hidden]) > section h1")?.focus({ preventScroll: true });
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
    const summary = { seconds: result.seconds, fillerCount: pitchMetrics(result).fillers.length };
    setSession((current) => nextTake(current, result));
    setPracticeHistory((current) => [...current, summary]);
    setStep("results");
  }

  return (
    <div className="phone-frame">
      <main className="phone-screen workspace-screen" id="main" ref={main} tabIndex={-1}>
        {step === "analyze" && <div><AnalyzeRecording onPractice={() => go("practice")} /></div>}
        <div hidden={step !== "wrapped"}>
          <Wrapped onPractice={() => go("practice")} />
        </div>
        {step === "practice" && (
          <div>
            <Practice attempt={(session?.attempt ?? 0) + 1} rule={session?.nextRule} onResult={save} onSample={() => go("sample")} onPreviousResults={session && (() => go("results"))} />
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
        {step === "challenges" && <Challenges takes={practiceHistory} onPractice={() => go("practice")} />}
        {step === "profile" && <Profile takes={practiceHistory} onPractice={() => go("practice")} />}
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
      <WorkspaceNav active={step === "sample" || step === "results" ? "practice" : step} onSelect={go} />
    </div>
  );
}
