import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { buildPrompt, AssistantInput } from "./prompts";

export const runAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AssistantInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { system, prompt } = buildPrompt(data);

    const result = streamText({
      model: gateway("google/gemini-3.6-flash"),
      system,
      prompt,
    });

    return { text: await result.text };
  });

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export const runChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ messages: z.array(ChatMessageSchema).min(1) }).parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const result = streamText({
      model: gateway("google/gemini-3.6-flash"),
      system: [
        "You are Aster, an AI workplace productivity assistant for busy professionals.",
        "Answer in a clear, professional, concise business tone.",
        "Structure answers with short markdown sections or bullets when it improves clarity.",
        "Prefer actionable next steps over generic advice. Never invent facts, figures, or citations; flag assumptions explicitly.",
      ].join("\n"),
      messages: data.messages,
    });

    return { text: await result.text };
  });
