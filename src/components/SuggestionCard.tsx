"use client";

import { useState } from "react";
import Link from "next/link";
import { chatCopy } from "@/lib/copy";
import type { Activity } from "@/lib/activities";

export type EnrichedSuggestion = {
  activityId: string;
  rationale: string;
  activity: Activity;
};

export function SuggestionCard({
  item,
  onNotForMe,
}: {
  item: EnrichedSuggestion;
  onNotForMe: () => void;
}) {
  const [showWhy, setShowWhy] = useState(false);
  const [more, setMore] = useState(false);

  const steps = more ? item.activity.steps : item.activity.steps.slice(0, 3);

  return (
    <div className="zen-card mt-3 p-5 text-left">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg text-[var(--color-stone)]">
            {item.activity.title}
          </h3>
          <p className="text-xs text-[var(--color-stone-muted)]">
            {item.activity.duration}
          </p>
        </div>
        <Link
          href={`/activity/${item.activity.slug}`}
          className="zen-button-primary shrink-0 px-4 py-2 text-xs font-medium"
        >
          {chatCopy.startActivity}
        </Link>
      </div>
      <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-[var(--color-stone-muted)]">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-2 text-xs text-[var(--color-accent)] hover:underline"
        onClick={() => setMore((m) => !m)}
      >
        {more ? "Less detail" : chatCopy.moreDetail}
      </button>
      <button
        type="button"
        className="mt-3 block text-xs font-medium text-[var(--color-stone-muted)] hover:text-[var(--color-stone)]"
        onClick={() => setShowWhy((w) => !w)}
      >
        {chatCopy.whyThis}
      </button>
      {showWhy && (
        <p className="mt-2 rounded-[var(--radius-sm)] bg-[var(--color-paper)] p-3 text-xs leading-relaxed text-[var(--color-stone-muted)]">
          {item.rationale}
        </p>
      )}
      <button
        type="button"
        className="mt-4 text-xs text-[var(--color-stone-muted)] underline-offset-2 hover:text-[var(--color-accent)] hover:underline"
        onClick={onNotForMe}
      >
        {chatCopy.notForMe}
      </button>
    </div>
  );
}
