"use client";

import { useState } from "react";
import Link from "next/link";
import { activityCopy } from "@/lib/copy";
import type { Activity } from "@/lib/activities";

export function ActivityPlayer({ activity }: { activity: Activity }) {
  const [step, setStep] = useState(0);
  const isLast = step >= activity.steps.length - 1;

  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col px-4 py-10">
      <p className="text-center text-xs text-[var(--color-stone-muted)]">
        Step {step + 1} of {activity.steps.length}
      </p>
      <h1 className="mt-4 text-center font-display text-2xl text-[var(--color-stone)]">
        {activity.title}
      </h1>
      <p className="mt-1 text-center text-xs text-[var(--color-stone-muted)]">
        {activity.duration}
      </p>

      <div className="zen-card mt-10 flex flex-1 flex-col p-6">
        <p className="text-base leading-relaxed text-[var(--color-stone)]">
          {activity.steps[step]}
        </p>
        <div className="mt-auto flex flex-wrap justify-between gap-3 pt-10">
          <button
            type="button"
            className="zen-button-ghost px-4 py-2 text-sm"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            {activityCopy.back}
          </button>
          {!isLast ? (
            <button
              type="button"
              className="zen-button-primary px-6 py-2 text-sm font-medium"
              onClick={() => setStep((s) => s + 1)}
            >
              {activityCopy.next}
            </button>
          ) : (
            <Link
              href="/chat"
              className="zen-button-primary inline-flex px-6 py-2 text-sm font-medium"
            >
              {activityCopy.done}
            </Link>
          )}
        </div>
      </div>

      <Link
        href="/chat"
        className="mt-6 block text-center text-sm text-[var(--color-stone-muted)] hover:text-[var(--color-stone)]"
      >
        {activityCopy.exit}
      </Link>
    </div>
  );
}
