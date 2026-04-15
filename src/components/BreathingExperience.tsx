"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { BreathPhase, Pace } from "@/lib/breathing";
import { phasesForPace } from "@/lib/breathing";
import { breathingCopy } from "@/lib/copy";
import {
  FORCE_REDUCED_MOTION_KEY,
  REDUCED_MOTION_SYNC_EVENT,
} from "@/lib/reduced-motion-preference";
import { saveSession } from "@/lib/session-storage";

export type VisualStyle = "orb" | "bar" | "text";

type Props = {
  pace: Pace;
  visual: VisualStyle;
  totalCycles: number;
  onComplete: () => void;
};

function useCalmMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => {
      let forced = false;
      try {
        forced = localStorage.getItem(FORCE_REDUCED_MOTION_KEY) === "1";
      } catch {
        /* ignore */
      }
      setReduced(mq.matches || forced);
    };
    read();
    mq.addEventListener("change", read);
    window.addEventListener(REDUCED_MOTION_SYNC_EVENT, read);
    return () => {
      mq.removeEventListener("change", read);
      window.removeEventListener(REDUCED_MOTION_SYNC_EVENT, read);
    };
  }, []);
  return reduced;
}

function phaseLabel(phase: BreathPhase): string {
  switch (phase) {
    case "inhale":
      return breathingCopy.phaseInhale;
    case "holdIn":
      return breathingCopy.phaseHoldIn;
    case "exhale":
      return breathingCopy.phaseExhale;
    case "holdOut":
      return breathingCopy.phaseHoldOut;
  }
}

export function BreathingExperience({
  pace,
  visual,
  totalCycles,
  onComplete,
}: Props) {
  const reducedMotion = useCalmMotion();
  const phaseList = useMemo(
    () => phasesForPace(pace).filter((p) => p.seconds > 0),
    [pace],
  );
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondInPhase, setSecondInPhase] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [paused, setPaused] = useState(false);
  const completedRef = useRef(false);

  const current = phaseList[phaseIdx] ?? phaseList[0];
  const currentPhase = current.phase;
  const currentDuration = Math.max(1, current.seconds);

  useEffect(() => {
    saveSession({ lastPath: "/breathe", breatheInProgress: true });
  }, []);

  const finishSession = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    saveSession({ lastPath: "/breathe", breatheInProgress: false });
    onComplete();
  }, [onComplete]);

  const tickPhase = useCallback(() => {
    if (completedRef.current) return;

    setPhaseIdx((pi) => {
      const atLast = pi >= phaseList.length - 1;
      if (!atLast) {
        return pi + 1;
      }
      setCycle((c) => {
        if (c >= totalCycles) {
          finishSession();
          return c;
        }
        return c + 1;
      });
      return 0;
    });
    setSecondInPhase(0);
  }, [finishSession, phaseList.length, totalCycles]);

  useEffect(() => {
    if (paused) return;
    if (completedRef.current) return;

    const t = window.setInterval(() => {
      setSecondInPhase((s) => {
        if (s + 1 >= currentDuration) {
          tickPhase();
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [currentDuration, paused, tickPhase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const orbScale =
    currentPhase === "inhale" || currentPhase === "holdIn" ? 1.12 : 0.92;
  const barWidth =
    currentPhase === "inhale" || currentPhase === "holdIn" ? "85%" : "35%";

  const secondsLeft = Math.max(1, currentDuration - secondInPhase);
  const announce = `${phaseLabel(currentPhase)}, ${secondsLeft} seconds`;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      <div className="mb-8 text-center">
        <p
          className="font-display text-2xl text-[var(--color-stone)] sm:text-3xl"
          aria-hidden
        >
          {phaseLabel(currentPhase)}
        </p>
        <p className="mt-2 text-4xl tabular-nums text-[var(--color-accent)]">
          {secondsLeft}
        </p>
        <p className="mt-2 text-sm text-[var(--color-stone-muted)]">
          {breathingCopy.cyclesProgress(Math.min(cycle, totalCycles), totalCycles)}
        </p>
      </div>

      {visual === "orb" && (
        <div
          className="relative mb-10 flex h-56 w-56 items-center justify-center"
          aria-hidden
        >
          <div
            className="absolute rounded-full bg-[var(--color-sage-soft)] opacity-80"
            style={{
              width: reducedMotion ? 200 : 200 * orbScale,
              height: reducedMotion ? 200 : 200 * orbScale,
              transition: reducedMotion
                ? "none"
                : `width var(--motion-breathe) cubic-bezier(0.45, 0, 0.55, 1), height var(--motion-breathe) cubic-bezier(0.45, 0, 0.55, 1)`,
            }}
          />
          <div
            className="absolute rounded-full border-2 border-[var(--color-sage)]"
            style={{
              width: reducedMotion ? 160 : 160 * orbScale,
              height: reducedMotion ? 160 : 160 * orbScale,
              transition: reducedMotion
                ? "none"
                : `width var(--motion-breathe) cubic-bezier(0.45, 0, 0.55, 1), height var(--motion-breathe) cubic-bezier(0.45, 0, 0.55, 1)`,
            }}
          />
        </div>
      )}

      {visual === "bar" && (
        <div
          className="mb-10 h-4 w-full max-w-xs overflow-hidden rounded-full bg-[var(--color-paper-elevated)]"
          aria-hidden
        >
          <div
            className="h-full rounded-full bg-[var(--color-sage)]"
            style={{
              width: reducedMotion ? "50%" : barWidth,
              transition: reducedMotion
                ? "none"
                : `width var(--motion-breathe) cubic-bezier(0.45, 0, 0.55, 1)`,
            }}
          />
        </div>
      )}

      {visual === "text" && (
        <p className="mb-10 max-w-sm text-center text-sm text-[var(--color-stone-muted)]">
          Follow the words and numbers. Inhale and exhale at your own comfort—nothing
          should feel strained.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className="zen-button-primary px-6 py-3 text-sm font-medium"
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? breathingCopy.resume : breathingCopy.pause}
        </button>
        <Link
          href="/chat"
          className="zen-button-ghost px-5 py-3 text-sm"
          onClick={() =>
            saveSession({ lastPath: "/chat", breatheInProgress: false })
          }
        >
          {breathingCopy.endEarly}
        </Link>
      </div>
      <p className="mt-6 text-xs text-[var(--color-stone-muted)]">
        Tip: press Space to pause or resume
      </p>
    </div>
  );
}
