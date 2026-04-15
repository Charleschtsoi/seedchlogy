import { positioning } from "@/lib/copy";

export function AiDisclosure({ usedAi }: { usedAi?: boolean }) {
  return (
    <p className="text-center text-xs leading-relaxed text-[var(--color-stone-muted)]">
      {positioning.aiNotice}
      {usedAi !== undefined && (
        <span className="block mt-1">
          {usedAi
            ? "This reply used an AI model."
            : "This reply used our offline guide (add OPENAI_API_KEY for AI)."}
        </span>
      )}
    </p>
  );
}
