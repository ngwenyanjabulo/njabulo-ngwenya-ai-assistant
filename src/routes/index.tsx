import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  NotebookPen,
  ListChecks,
  Search,
  MessageSquare,
  ArrowRight,
  Clock,
  Gauge,
  Sparkles,
} from "lucide-react";
import { AppShell, Disclaimer } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aster — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate daily work: draft emails, summarise meetings, plan tasks, research topics and chat with an AI assistant built for professionals.",
      },
      { property: "og:title", content: "Aster — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Five AI workflows for professionals: email drafting, meeting summaries, task planning, research and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    copy: "Tone- and audience-aware drafts with subject line options.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    copy: "Key points, decisions, owners and deadlines from raw notes.",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    copy: "Impact-based prioritisation and a schedule that fits your day.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    copy: "Structured briefs with insights, risks and next steps.",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "Assistant Chat",
    copy: "Open-ended help with full conversation context.",
  },
] as const;

const stats = [
  { icon: Clock, label: "Typical time saved", value: "4–6 hrs / week" },
  { icon: Gauge, label: "Workflows available", value: "5 AI tools" },
  { icon: Sparkles, label: "Prompting", value: "Structured & role-based" },
];

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspace for everyday professional tasks."
    >
      <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <p className="text-xs font-medium tracking-wide text-brand uppercase">
          AI Workplace Productivity Assistant
        </p>
        <h2 className="mt-2 max-w-xl text-2xl font-semibold text-foreground sm:text-3xl">
          Automate the busywork. Keep the judgement.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Five focused AI workflows built around structured prompts, so outputs arrive clear,
          consistent and ready for a quick human review.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/email">
              Draft an email <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/chat">Open assistant chat</Link>
          </Button>
        </div>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="shadow-card">
            <CardContent className="flex items-center gap-3 py-5">
              <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map(({ to, icon: Icon, title, copy }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full shadow-card transition-all group-hover:-translate-y-0.5 group-hover:border-brand/40">
              <CardHeader className="space-y-3">
                <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Icon className="size-4" />
                </span>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{copy}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand">
                  Open <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <div className="mt-6">
        <Disclaimer />
      </div>
    </AppShell>
  );
}
