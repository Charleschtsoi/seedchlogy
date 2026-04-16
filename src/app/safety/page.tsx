import Link from "next/link";
import { ZenShell } from "@/components/ZenShell";
import { crisis, positioning, SITE_NAME } from "@seedchlogy/shared";

export default function SafetyPage() {
  return (
    <ZenShell>
      <div className="mx-auto max-w-xl flex-1 px-4 py-12">
        <h1 className="font-display text-3xl text-[var(--color-stone)]">
          Safety &amp; scope
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-stone-muted)]">
          {SITE_NAME} is a calm space for breathing and light wellness ideas. It is{" "}
          <strong className="font-medium text-[var(--color-stone)]">not</strong> a
          substitute for therapy, diagnosis, or crisis services.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-stone-muted)]">
          {positioning.wellnessOnly}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-stone-muted)]">
          {positioning.aiNotice}
        </p>

        <h2 className="mt-10 font-display text-xl text-[var(--color-stone)]">
          If you might be in danger
        </h2>
        <p className="mt-2 text-sm text-[var(--color-stone-muted)]">{crisis.leadIn}</p>
        <ul className="mt-4 space-y-3 text-sm">
          {crisis.lines.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-medium text-[var(--color-crisis-link)] underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
              {"phone" in l && l.phone ? (
                <span className="text-[var(--color-stone-muted)]"> — {l.phone}</span>
              ) : null}
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-display text-xl text-[var(--color-stone)]">
          Privacy (short)
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-stone-muted)]">
          Chat messages are sent to our server to call the AI when configured. We don’t
          use them for advertising. For production, add a full privacy policy and data
          retention rules your jurisdiction requires.
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
