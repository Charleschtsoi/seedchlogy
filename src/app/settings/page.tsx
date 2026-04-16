"use client";

import Link from "next/link";
import { ZenShell } from "@/components/ZenShell";
import { settingsCopy } from "@seedchlogy/shared";
import { useForceReducedMotion } from "@/lib/reduced-motion-preference";

export default function SettingsPage() {
  const [forceReduced, setForceReduced] = useForceReducedMotion();

  const systemReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <ZenShell>
      <div className="mx-auto max-w-xl flex-1 px-4 py-12">
        <h1 className="font-display text-3xl text-[var(--color-stone)]">
          {settingsCopy.title}
        </h1>
        <p className="mt-4 text-sm text-[var(--color-stone-muted)]">
          {settingsCopy.soundNote}
        </p>

        <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-accent-soft)]/50 bg-[var(--color-paper-elevated)] p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-[var(--color-stone-muted)] text-[var(--color-accent)]"
            checked={forceReduced}
            onChange={(e) => setForceReduced(e.target.checked)}
          />
          <span className="text-sm text-[var(--color-stone)]">
            {settingsCopy.reducedMotion}
            {systemReduced && (
              <span className="mt-1 block text-xs text-[var(--color-sage)]">
                Your system already prefers reduced motion—we honor that in breathing
                animations.
              </span>
            )}
          </span>
        </label>

        <p className="mt-6 text-xs text-[var(--color-stone-muted)]">
          Forced reduced motion is stored only in your browser (localStorage).
        </p>

        <Link
          href="/"
          className="mt-10 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Back home
        </Link>
      </div>
    </ZenShell>
  );
}
