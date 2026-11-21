"use client";

import { useState } from "react";
import { Wrapped } from "@/components/wrapped";

export default function Home() {
  const [step, setStep] = useState<"wrapped" | "practice">("wrapped");

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
          <section className="hero">
            <p className="eyebrow">Pitch practice</p>
            <h1>Make your<br /><em>point.</em></h1>
          </section>
        )}
      </main>
    </>
  );
}
