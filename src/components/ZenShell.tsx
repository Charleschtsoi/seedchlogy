import Link from "next/link";
import { SITE_NAME } from "@/lib/copy";

export function ZenShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-[var(--color-accent-soft)]/40 bg-[var(--color-paper)]/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-lg tracking-tight text-[var(--color-stone)] hover:text-[var(--color-accent)]"
          >
            {SITE_NAME}
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-stone-muted)]">
            <Link href="/breathe" className="hover:text-[var(--color-stone)]">
              Breathe
            </Link>
            <Link href="/chat" className="hover:text-[var(--color-stone)]">
              Guide
            </Link>
            <Link href="/settings" className="hover:text-[var(--color-stone)]">
              Settings
            </Link>
            <Link
              href="/safety"
              className="font-medium text-[var(--color-crisis-link)] hover:underline"
            >
              Safety
            </Link>
          </nav>
        </div>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
