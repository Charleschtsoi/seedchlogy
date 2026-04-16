"use client";

import { useState } from "react";
import Link from "next/link";
import { BreathingExperience, type VisualStyle } from "@/components/BreathingExperience";
import { breathingCopy, positioning, type Pace } from "@seedchlogy/shared";

type Step = "setup" | "session" | "done";

export function BreatheClient() {
  const [step, setStep] = useState<Step>("setup");
  const [pace, setPace] = useState<Pace>("slow");
  const [visual, setVisual] = useState<VisualStyle>("orb");
  const [posture, setPosture] = useState<"sitting" | "lying">("sitting");
  const [cycles, setCycles] = useState(4);

  if (step === "session") {
    return (
      <BreathingExperience
        pace={pace}
        visual={visual}
        totalCycles={cycles}
        onComplete={() => setStep("done")}
      />
    );
  }

  if (step === "done") {
    return (
      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="font-display text-2xl text-[var(--color-stone)] sm:text-3xl">
          {breathingCopy.completeTitle}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-stone-muted)]">
          {positioning.reassurance}
        </p>
        <Link
          href="/chat"
          className="zen-button-primary mt-10 inline-flex px-8 py-3 text-sm font-medium"
        >
          {breathingCopy.continueToChat}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col px-4 py-10">
      <h1 className="font-display text-2xl text-[var(--color-stone)]">
        {breathingCopy.setupTitle}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-stone-muted)]">
        Defaults are gentle—you can start in one tap or adjust first.
      </p>

      <fieldset className="mt-8 space-y-3">
        <legend className="text-sm font-medium text-[var(--color-stone)]">
          How are you resting?
        </legend>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPosture("sitting")}
            className={`rounded-full px-4 py-2 text-sm ${
              posture === "sitting"
                ? "bg-[var(--color-sage-soft)] text-[var(--color-stone)]"
                : "bg-[var(--color-paper-elevated)] text-[var(--color-stone-muted)]"
            }`}
          >
            {breathingCopy.postureSitting}
          </button>
          <button
            type="button"
            onClick={() => setPosture("lying")}
            className={`rounded-full px-4 py-2 text-sm ${
              posture === "lying"
                ? "bg-[var(--color-sage-soft)] text-[var(--color-stone)]"
                : "bg-[var(--color-paper-elevated)] text-[var(--color-stone-muted)]"
            }`}
          >
            {breathingCopy.postureLying}
          </button>
        </div>
      </fieldset>

      <fieldset className="mt-6 space-y-3">
        <legend className="text-sm font-medium text-[var(--color-stone)]">Pace</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["slow", breathingCopy.paceSlow],
              ["medium", breathingCopy.paceMedium],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPace(key)}
              className={`rounded-full px-4 py-2 text-sm ${
                pace === key
                  ? "bg-[var(--color-sage-soft)] text-[var(--color-stone)]"
                  : "bg-[var(--color-paper-elevated)] text-[var(--color-stone-muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6 space-y-3">
        <legend className="text-sm font-medium text-[var(--color-stone)]">
          {breathingCopy.customize}
        </legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["orb", breathingCopy.visualOrb],
              ["bar", breathingCopy.visualBar],
              ["text", breathingCopy.visualText],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setVisual(key)}
              className={`rounded-full px-4 py-2 text-sm ${
                visual === key
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-stone)]"
                  : "bg-[var(--color-paper-elevated)] text-[var(--color-stone-muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6 space-y-3">
        <legend className="text-sm font-medium text-[var(--color-stone)]">
          Cycles (about a minute on slow with 4)
        </legend>
        <div className="flex flex-wrap gap-2">
          {[4, 6, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCycles(n)}
              className={`rounded-full px-4 py-2 text-sm ${
                cycles === n
                  ? "bg-[var(--color-warm-gold)]/35 text-[var(--color-stone)]"
                  : "bg-[var(--color-paper-elevated)] text-[var(--color-stone-muted)]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          className="zen-button-primary px-8 py-3 text-sm font-medium"
          onClick={() => setStep("session")}
        >
          {breathingCopy.start}
        </button>
        <button
          type="button"
          className="zen-button-ghost px-5 py-3 text-sm"
          onClick={() => {
            setPosture("sitting");
            setPace("slow");
            setVisual("orb");
            setCycles(4);
            setStep("session");
          }}
        >
          {breathingCopy.skipSetup}
        </button>
      </div>
    </div>
  );
}
