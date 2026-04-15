import Link from "next/link";
import { ZenShell } from "@/components/ZenShell";

export default function NotFound() {
  return (
    <ZenShell>
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-[var(--color-stone)]">
          This page isn’t here
        </h1>
        <p className="mt-3 text-sm text-[var(--color-stone-muted)]">
          Let’s go somewhere softer.
        </p>
        <Link
          href="/"
          className="zen-button-primary mt-8 px-8 py-3 text-sm font-medium"
        >
          Home
        </Link>
      </div>
    </ZenShell>
  );
}
