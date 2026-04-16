"use client";

import { useMemo } from "react";
import Link from "next/link";
import { crisis, landing, positioning, SITE_NAME } from "@seedchlogy/shared";
import { useSessionSnapshot } from "@/lib/session-storage";

const ROTATING = [
  "You don’t have to earn rest.",
  "However today feels, you can move at a softer pace here.",
  "Nothing here asks you to perform—only to arrive.",
];

export function HomeClient() {
  const session = useSessionSnapshot();

  const line = useMemo(() => {
    const d = new Date();
    return ROTATING[(d.getDate() + d.getHours()) % ROTATING.length];
  }, []);

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center px-4 py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-sage)]">
        {SITE_NAME}
      </p>
      <h1 className="mt-4 font-display text-3xl leading-tight text-[var(--color-stone)] sm:text-4xl">
        {positioning.tagline}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-stone-muted)]">
        {line}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-[var(--color-stone-muted)]">
        {positioning.reassurance}
      </p>

      {session?.breatheInProgress && (
        <Link
          href="/breathe"
          className="mt-8 block w-full max-w-sm rounded-full border border-[var(--color-sage)]/40 bg-[var(--color-sage-soft)]/50 py-3 text-sm font-medium text-[var(--color-stone)]"
        >
          {landing.resumeBreathing}
        </Link>
      )}

      {session?.lastPath === "/chat" && !session?.breatheInProgress && (
        <Link
          href="/chat"
          className="mt-8 block w-full max-w-sm rounded-full border border-[var(--color-accent-soft)] bg-[var(--color-paper-elevated)] py-3 text-sm font-medium text-[var(--color-stone)]"
        >
          {landing.resumeChat}
        </Link>
      )}

      <Link
        href="/breathe"
        className="zen-button-primary mt-10 inline-flex w-full max-w-sm justify-center px-8 py-4 text-sm font-medium"
      >
        {landing.primaryCta}
      </Link>
      <Link
        href="/chat"
        className="zen-button-ghost mt-3 inline-flex w-full max-w-sm justify-center px-6 py-3 text-sm"
      >
        {landing.secondaryCta}
      </Link>

      <div className="mt-12 w-full max-w-sm rounded-[var(--radius-md)] bg-[var(--color-crisis-bg)] px-4 py-3 text-left">
        <p className="text-xs font-medium text-[var(--color-crisis-link)]">
          {crisis.leadIn}
        </p>
        <ul className="mt-2 space-y-1 text-xs">
          {crisis.lines.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[var(--color-crisis-link)] underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
              {"phone" in l && l.phone ? ` — ${l.phone}` : null}
            </li>
          ))}
        </ul>
        <Link
          href="/safety"
          className="mt-2 inline-block text-xs font-medium text-[var(--color-stone)] underline"
        >
          More on safety &amp; disclaimers
        </Link>
      </div>

      <p className="mt-8 text-[10px] leading-relaxed text-[var(--color-stone-muted)]">
        {positioning.aiNotice} {positioning.wellnessOnly}
      </p>
    </main>
  );
}
