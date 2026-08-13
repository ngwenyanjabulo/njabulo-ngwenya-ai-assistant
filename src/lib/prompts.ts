import { z } from "zod";

export const AssistantInput = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("email"),
    purpose: z.string(),
    audience: z.string(),
    tone: z.string(),
    length: z.string(),
    context: z.string().optional(),
  }),
  z.object({
    kind: z.literal("notes"),
    notes: z.string(),
    meetingTitle: z.string().optional(),
  }),
  z.object({
    kind: z.literal("planner"),
    tasks: z.string(),
    horizon: z.string(),
    hoursPerDay: z.string(),
  }),
  z.object({
    kind: z.literal("research"),
    topic: z.string(),
    depth: z.string(),
    angle: z.string().optional(),
  }),
]);

export type AssistantInputType = z.infer<typeof AssistantInput>;

const BASE_SYSTEM = [
  "You are an expert workplace productivity assistant used inside a professional SaaS tool.",
  "Write in clear, precise business English. No filler, no hype, no emojis unless asked.",
  "Always return well-structured markdown with headings and bullets where useful.",
  "Never fabricate names, numbers, dates, quotes, or sources. If information is missing, state the assumption in an 'Assumptions' line.",
].join("\n");

export function buildPrompt(data: AssistantInputType): { system: string; prompt: string } {
  switch (data.kind) {
    case "email":
      return {
        system: `${BASE_SYSTEM}\nYou specialise in professional email writing that matches tone and audience exactly.`,
        prompt: [
          "TASK: Draft a workplace email.",
          `PURPOSE: ${data.purpose}`,
          `AUDIENCE: ${data.audience}`,
          `TONE: ${data.tone}`,
          `LENGTH: ${data.length}`,
          data.context ? `CONTEXT / KEY POINTS:\n${data.context}` : "CONTEXT: none supplied.",
          "",
          "OUTPUT FORMAT (markdown):",
          "**Subject:** <one compelling subject line>",
          "",
          "<email body with greeting, 1-3 tight paragraphs, clear ask, sign-off placeholder [Your name]>",
          "",
          "**Alternative subject lines:** two bullets.",
          "**Tone check:** one sentence confirming how the draft matches the requested tone and audience.",
        ].join("\n"),
      };
    case "notes":
      return {
        system: `${BASE_SYSTEM}\nYou specialise in turning messy meeting notes into decision-ready summaries.`,
        prompt: [
          "TASK: Summarise the raw meeting notes below.",
          data.meetingTitle ? `MEETING: ${data.meetingTitle}` : "",
          "RAW NOTES:",
          data.notes,
          "",
          "OUTPUT FORMAT (markdown, use these exact headings):",
          "## Executive summary — 2-3 sentences.",
          "## Key discussion points — bullets, grouped by theme.",
          "## Decisions made — bullets; write 'None recorded' if absent.",
          "## Action items — markdown table with columns: Action | Owner | Deadline. Use 'Unassigned' / 'No date' when unclear.",
          "## Risks & open questions — bullets.",
          "Only use information present in the notes.",
        ]
          .filter(Boolean)
          .join("\n"),
      };
    case "planner":
      return {
        system: `${BASE_SYSTEM}\nYou specialise in prioritisation (impact vs. urgency) and realistic scheduling.`,
        prompt: [
          "TASK: Prioritise and schedule the tasks below.",
          `PLANNING HORIZON: ${data.horizon}`,
          `AVAILABLE FOCUS HOURS PER DAY: ${data.hoursPerDay}`,
          "TASKS:",
          data.tasks,
          "",
          "OUTPUT FORMAT (markdown, use these exact headings):",
          "## Priority ranking — table: # | Task | Priority (P1-P3) | Est. effort | Why it ranks here.",
          "## Suggested schedule — grouped by day/block within the horizon, respecting the available focus hours.",
          "## Quick wins — tasks under 30 minutes.",
          "## Defer or delegate — tasks that should not consume focus time, with a reason.",
          "Never schedule more work than the stated capacity allows.",
        ].join("\n"),
      };
    case "research":
      return {
        system: `${BASE_SYSTEM}\nYou specialise in structured business research briefs based on general knowledge, not live web access.`,
        prompt: [
          "TASK: Produce a research brief.",
          `TOPIC: ${data.topic}`,
          `DEPTH: ${data.depth}`,
          data.angle ? `ANGLE / DECISION IT SUPPORTS: ${data.angle}` : "",
          "",
          "OUTPUT FORMAT (markdown, use these exact headings):",
          "## Snapshot — 3 sentence overview.",
          "## Key insights — 4-6 bullets, each with a short 'so what' implication.",
          "## Opportunities and risks — two short lists.",
          "## Recommended next steps — numbered, concrete.",
          "## What to verify — bullets naming the facts a human should confirm from primary sources.",
          "State clearly that you have no live web access and that figures are indicative.",
        ]
          .filter(Boolean)
          .join("\n"),
      };
  }
}
