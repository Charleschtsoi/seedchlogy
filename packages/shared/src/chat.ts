import type { Activity } from "./activities";

export type ChatRole = "user" | "assistant";

export type ChatMessage = { role: ChatRole; content: string };

export type EnrichedSuggestion = {
  activityId: string;
  rationale: string;
  activity: Activity;
};

export type ChatApiResponse = {
  reply: string;
  suggestions: EnrichedSuggestion[];
  crisis: boolean;
  followUpQuestion: string | null;
  usedAi: boolean;
};

/** Normalize base URL (no trailing slash). */
export function normalizeApiBase(url: string): string {
  return url.replace(/\/+$/, "");
}

export async function postChat(
  baseUrl: string,
  messages: ChatMessage[],
): Promise<ChatApiResponse> {
  const root = normalizeApiBase(baseUrl);
  const res = await fetch(`${root}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = (await res.json()) as ChatApiResponse & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `Chat request failed (${res.status})`);
  }
  return data;
}
