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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Aster Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional work emails in seconds with tone and audience controls, plus alternative subject lines.",
      },
      { property: "og:title", content: "Smart Email Generator | Aster Workplace AI" },
      {
        property: "og:description",
        content: "Tone- and audience-aware AI email drafting for busy professionals.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(runAssistant);
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("Client");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Short (under 120 words)");
  const [context, setContext] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      run({ data: { kind: "email" as const, purpose, audience, tone, length, context } }),
  });

  return (
    <AppShell
      title="Smart Email Generator"
      description="Tone- and audience-aware drafts, ready to send after a quick review."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">What is the email about?</Label>
              <Input
                id="purpose"
                placeholder="Follow up on the Q3 pricing proposal"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Client", "Executive / leadership", "Direct team", "Cross-functional partner", "Vendor", "Candidate"].map(
                      (o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Professional", "Friendly", "Direct", "Persuasive", "Apologetic", "Formal"].map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Short (under 120 words)",
                    "Medium (120-220 words)",
                    "Detailed (220-350 words)",
                  ].map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Key points / context (optional)</Label>
              <Textarea
                id="context"
                rows={5}
                placeholder="Deal value, previous conversation, deadline, attachments…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={!purpose.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              <Wand2 className="size-4" />
              {mutation.isPending ? "Drafting…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <OutputPanel
          title="Draft"
          loading={mutation.isPending}
          error={mutation.error ? "Generation failed. Please try again in a moment." : null}
          output={mutation.data?.text}
          emptyHint="Fill in the brief and generate a draft with a subject line, body and tone check."
        />
      </div>
    </AppShell>
  );
}
