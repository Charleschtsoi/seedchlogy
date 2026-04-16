import Link from "next/link";
import { chatCopy } from "@seedchlogy/shared";

export function CrisisBanner() {
  return (
    <div
      className="rounded-[var(--radius-md)] border border-[var(--color-crisis-link)]/25 bg-[var(--color-crisis-bg)] px-4 py-3 text-sm text-[var(--color-stone)]"
      role="status"
    >
      <p className="mb-2">{chatCopy.crisisBanner}</p>
      <Link
        href="/safety"
        className="font-medium text-[var(--color-crisis-link)] underline underline-offset-2"
      >
        Open safety resources
      </Link>
    </div>
  );
}
