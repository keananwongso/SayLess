"use client";

import { useState } from "react";
import { Practice } from "@/components/practice";
import { Wrapped } from "@/components/wrapped";
import type { Take } from "@/lib/practice";

export default function Home() {
  const [step, setStep] = useState<"wrapped" | "practice" | "results">("wrapped");
  const [take, setTake] = useState<Take>();

  return (
    <>
      <header className="site-header">
        <button className="wordmark" onClick={() => setStep("wrapped")}>
          SayLess<span>.</span>
        </button>
        <nav aria-label="Demo">
          <button aria-current={step === "wrapped" ? "page" : undefined} onClick={() => setStep("wrapped")}>
            Wrapped
          </button>
          <button aria-current={step === "practice" ? "page" : undefined} onClick={() => setStep("practice")}>
            Practice
          </button>
        </nav>
      </header>
      <main className="shell">
        <div hidden={step !== "wrapped"}>
          <Wrapped onPractice={() => setStep("practice")} />
        </div>
        {step === "practice" && (
          <Practice attempt={1} onResult={(result) => {
            setTake(result);
            setStep("results");
          }} />
        )}
        {step === "results" && take && (
          <section className="panel">
            <h1>Coach feedback</h1>
            <p>{take.suggestion}</p>
            <p>{take.transcript}</p>
          </section>
        )}
      </main>
    </>
  );
}
