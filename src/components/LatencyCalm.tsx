"use client";

/**
 * Gentle focal animation while waiting for the model — keeps the page feeling "zen".
 */
export function LatencyCalm() {
  return (
    <div
      className="flex items-center gap-2 py-2 text-[var(--color-stone-muted)]"
      aria-hidden
    >
      <span className="inline-flex gap-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-sage)] opacity-60 [animation-duration:1.4s]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-sage)] opacity-60 [animation-delay:200ms] [animation-duration:1.4s]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-sage)] opacity-60 [animation-delay:400ms] [animation-duration:1.4s]" />
      </span>
      <span className="text-xs">{/* filled by parent */}</span>
    </div>
  );
}
