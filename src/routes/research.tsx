import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { runAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Aster Workplace AI" },
      {
        name: "description",
        content:
          "Generate structured research briefs with insights, risks, next steps and a list of facts to verify.",
      },
      { property: "og:title", content: "AI Research Assistant | Aster Workplace AI" },
      {
        property: "og:description",
        content: "Structured business research briefs in seconds.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(runAssistant);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Standard brief");
  const [angle, setAngle] = useState("");

  const mutation = useMutation({
    mutationFn: () => run({ data: { kind: "research" as const, topic, depth, angle } }),
  });

  return (
    <AppShell
      title="AI Research Assistant"
      description="Structured briefs with insights, risks and what a human should verify."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Research request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or question</Label>
              <Input
                id="topic"
                placeholder="Pricing models for B2B onboarding software"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Quick scan", "Standard brief", "Deep dive"].map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="angle">Decision this supports (optional)</Label>
              <Textarea
                id="angle"
                rows={5}
                placeholder="We're choosing between per-seat and usage-based pricing for Q4."
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={!topic.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              <Wand2 className="size-4" />
              {mutation.isPending ? "Researching…" : "Generate brief"}
            </Button>
          </CardContent>
        </Card>

        <OutputPanel
          title="Research brief"
          loading={mutation.isPending}
          error={mutation.error ? "Research failed. Please try again in a moment." : null}
          output={mutation.data?.text}
          emptyHint="Describe a topic to get a snapshot, key insights, risks, next steps and verification checklist."
        />
      </div>
    </AppShell>
  );
}
