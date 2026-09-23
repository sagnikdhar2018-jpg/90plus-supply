import { createServerFn } from "@tanstack/react-start";

export const askMatchAi = createServerFn({ method: "POST" })
  .validator((input: { question: string; context?: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not available in this environment" };
    }
    const q = data.question.trim().slice(0, 400);
    if (!q) return { ok: false as const, error: "Ask a short question first." };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 280,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are the 90+ Supply matchday kit advisor for an Indian football accessories shop. Be concise (max 90 words). Help with PSI (11.6–14.5), surfaces, position kits, sizing, 48h metro dispatch, FIRST90 ₹150 off, and custom-embossed balls being final sale. Never invent SKUs that are not in the catalog context. Prices are INR. No markdown headings.",
          },
          {
            role: "user",
            content: `${data.context ? `Catalog context:\n${data.context.slice(0, 1800)}\n\n` : ""}Question: ${q}`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: `xAI API error ${res.status}` };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { ok: true as const, text: body.choices?.[0]?.message?.content ?? "" };
  });
