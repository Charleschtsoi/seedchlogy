"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiDisclosure } from "@/components/AiDisclosure";
import { CrisisBanner } from "@/components/CrisisBanner";
import { LatencyCalm } from "@/components/LatencyCalm";
import { SuggestionCard, type EnrichedSuggestion } from "@/components/SuggestionCard";
import { chatCopy, positioning } from "@seedchlogy/shared";
import { saveSession } from "@/lib/session-storage";

type ChatMessage = { role: "user" | "assistant"; content: string };

const OPENING: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi—I’m here to help you find something small and kind for your body and attention. No pressure to explain perfectly.",
  },
  {
    role: "assistant",
    content:
      "If you’d like, tap a chip or write a few words about how things feel right now.",
  },
];

const WELCOME_ROTATION = [
  "Welcome back. There’s no rush here.",
  "Hello again. However you arrived is okay.",
  "Good to see you. Let’s keep things gentle.",
];

export function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>(OPENING);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [lastSuggestions, setLastSuggestions] = useState<EnrichedSuggestion[]>(
    [],
  );
  const [usedAi, setUsedAi] = useState<boolean | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveSession({ lastPath: "/chat", breatheInProgress: false });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, lastSuggestions]);

  const welcomeExtra = useMemo(() => {
    const d = new Date();
    return WELCOME_ROTATION[(d.getDate() + d.getMonth()) % WELCOME_ROTATION.length];
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);
      setLastSuggestions([]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              content:
                "Something glitched on our side. Want to take one slow breath, then try again?",
            },
          ]);
          return;
        }
        setUsedAi(Boolean(data.usedAi));
        setCrisis(Boolean(data.crisis));
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.reply as string },
        ]);
        if (data.followUpQuestion) {
          setMessages((m) => [
            ...m,
            { role: "assistant", content: data.followUpQuestion as string },
          ]);
        }
        setLastSuggestions((data.suggestions ?? []) as EnrichedSuggestion[]);
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "I couldn’t reach the guide just now. If you can, try again in a moment—or visit the Breathe page for a quiet rhythm.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  const onNotForMe = () => {
    void send(
      "That suggestion wasn’t a fit for me—could you offer another gentle option?",
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-6">
      <p className="text-center text-xs text-[var(--color-stone-muted)]">
        {welcomeExtra}
      </p>
      <p className="mt-2 text-center text-xs text-[var(--color-stone-muted)]">
        {positioning.wellnessOnly}
      </p>

      {crisis && (
        <div className="mt-4">
          <CrisisBanner />
        </div>
      )}

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto pb-28">
        {messages.map((m, i) => (
          <div
            key={`${i}-${m.content.slice(0, 12)}`}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-[var(--radius-lg)] px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-stone)]"
                  : "bg-[var(--color-paper-elevated)] text-[var(--color-stone)]"
              }`}
            >
              {m.role === "assistant" && (
                <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-[var(--color-sage)]">
                  {chatCopy.aiBadge}
                </span>
              )}
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="zen-card max-w-[90%] px-4 py-3">
              <LatencyCalm />
              <span className="text-xs text-[var(--color-stone-muted)]">
                {chatCopy.typing}
              </span>
            </div>
          </div>
        )}

        {lastSuggestions.map((s) => (
          <SuggestionCard key={s.activityId} item={s} onNotForMe={onNotForMe} />
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--color-accent-soft)]/30 bg-[var(--color-paper)]/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-[560px]">
          <div className="mb-2 flex flex-wrap gap-2">
            {chatCopy.chips.map((c) => (
              <button
                key={c}
                type="button"
                className="rounded-full bg-[var(--color-paper-elevated)] px-3 py-1.5 text-xs text-[var(--color-stone)] hover:bg-[var(--color-sage-soft)]"
                onClick={() => void send(c)}
                disabled={loading}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <input
              id="chat-input"
              className="min-w-0 flex-1 rounded-full border border-[var(--color-accent-soft)] bg-[var(--color-paper-elevated)] px-4 py-3 text-sm text-[var(--color-stone)] placeholder:text-[var(--color-stone-muted)]"
              placeholder={chatCopy.inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              disabled={loading}
            />
            <button
              type="button"
              className="zen-button-primary shrink-0 px-5 py-3 text-sm"
              onClick={() => void send(input)}
              disabled={loading || !input.trim()}
            >
              {chatCopy.send}
            </button>
          </div>
          <div className="mt-2">
            <AiDisclosure usedAi={usedAi} />
          </div>
        </div>
      </div>
    </div>
  );
}
