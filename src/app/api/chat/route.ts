import { ACTIVITIES, ACTIVITY_IDS, type ActivitySlug } from "@/lib/activities";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

type SuggestionPayload = {
  activityId: ActivitySlug;
  rationale: string;
};

const SYSTEM = `You are a warm, concise wellness guide for a relaxation website. You are NOT a therapist or doctor.

Rules:
- Offer gentle wellness suggestions only—breathing, grounding, light movement, visualization.
- Never diagnose, treat, or give medical instructions. If asked for clinical or crisis help, say you can't and encourage professional or crisis resources.
- If the user expresses self-harm, hopelessness, or immediate danger, set crisis to true and keep reply very short, compassionate, and point to safety resources.
- Reply in 2–4 short sentences by default. Inviting tone ("Want to try…", "If it feels okay…").
- Pick 1–2 activities from this exact id list only: ${ACTIVITY_IDS.join(", ")}.
- Match activity to user need: overstimulation → grounding-54321 or nature-visualization; tension → pmr-lite or gentle-stretch; racing thoughts → extended-exhale-breath or grounding-54321; generic stress → extended-exhale-breath.

Return ONLY valid JSON with this shape:
{"reply":"string","suggestions":[{"activityId":"one-of-ids","rationale":"one short plain sentence"}],"crisis":false,"followUpQuestion":null-or-short-string}

At most one followUpQuestion when ambiguous; otherwise null. Max 2 suggestions.`;

function mockResponse(userText: string): {
  reply: string;
  suggestions: SuggestionPayload[];
  crisis: boolean;
  followUpQuestion: string | null;
} {
  const crisis =
    /\b(kill myself|suicide|end it all|hurt myself|can't go on)\b/i.test(
      userText,
    );

  if (crisis) {
    return {
      reply:
        "I’m really glad you wrote something. I’m not able to help with crisis here—but you deserve support right now. Please reach out to the 988 Lifeline or local emergency services.",
      suggestions: [],
      crisis: true,
      followUpQuestion: null,
    };
  }

  let suggestions: SuggestionPayload[] = [
    {
      activityId: "extended-exhale-breath",
      rationale:
        "A slightly longer exhale can help your body shift toward calm without forcing anything.",
    },
  ];

  if (/noise|loud|overstim|busy|too much/i.test(userText)) {
    suggestions = [
      {
        activityId: "grounding-54321",
        rationale:
          "You mentioned feeling overloaded—grounding through the senses can gently narrow the spotlight.",
      },
    ];
  } else if (/tight|chest|shoulder|tense|knot/i.test(userText)) {
    suggestions = [
      {
        activityId: "pmr-lite",
        rationale:
          "When the body feels tight, a soft release sequence can meet it without pushing.",
      },
    ];
  } else if (/sleep|bed|night|wind down/i.test(userText)) {
    suggestions = [
      {
        activityId: "nature-visualization",
        rationale:
          "A quiet nature picture paired with slow breaths often helps the mind ease toward rest.",
      },
    ];
  }

  return {
    reply:
      "Thanks for trusting this space with that. If you’d like, we can try something small and kind for your body right now.",
    suggestions,
    crisis: false,
    followUpQuestion: null,
  };
}

async function openAiComplete(messages: ChatMessage[]): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: SYSTEM }, ...messages],
    }),
  });

  if (!res.ok) {
    console.error("OpenAI error", await res.text());
    return null;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages?: ChatMessage[];
    };
    const messages = body.messages?.filter((m) => m.content?.trim()) ?? [];
    if (!messages.length) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const userText = lastUser?.content ?? "";

    let parsed: {
      reply: string;
      suggestions: SuggestionPayload[];
      crisis: boolean;
      followUpQuestion: string | null;
    };

    const raw = await openAiComplete(messages);
    if (raw) {
      try {
        parsed = JSON.parse(raw) as typeof parsed;
        parsed.suggestions = (parsed.suggestions ?? []).filter((s) =>
          ACTIVITY_IDS.includes(s.activityId),
        );
      } catch {
        parsed = mockResponse(userText);
      }
    } else {
      parsed = mockResponse(userText);
    }

    const enriched = parsed.suggestions.map((s) => ({
      ...s,
      activity: ACTIVITIES[s.activityId],
    }));

    return NextResponse.json({
      reply: parsed.reply,
      suggestions: enriched,
      crisis: Boolean(parsed.crisis),
      followUpQuestion: parsed.followUpQuestion ?? null,
      usedAi: Boolean(process.env.OPENAI_API_KEY && raw),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
