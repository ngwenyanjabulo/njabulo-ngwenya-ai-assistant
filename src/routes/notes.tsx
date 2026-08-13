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
import { runAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Aster Workplace AI" },
      {
        name: "description",
        content:
          "Turn messy meeting notes into an executive summary, decisions, owners and deadlines in one click.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Aster Workplace AI" },
      {
        property: "og:description",
        content: "Key points, decisions, action items and deadlines extracted automatically.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const run = useServerFn(runAssistant);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [notes, setNotes] = useState("");

  const mutation = useMutation({
    mutationFn: () => run({ data: { kind: "notes" as const, notes, meetingTitle } }),
  });

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Key points, decisions, owners and deadlines — extracted from raw notes."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Raw notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting title (optional)</Label>
              <Input
                id="title"
                placeholder="Weekly product sync — 12 Mar"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Paste your notes or transcript</Label>
              <Textarea
                id="notes"
                rows={16}
                placeholder="- Sara: onboarding drop-off at step 3…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={notes.trim().length < 20 || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              <Wand2 className="size-4" />
              {mutation.isPending ? "Summarising…" : "Summarize notes"}
            </Button>
          </CardContent>
        </Card>

        <OutputPanel
          title="Summary"
          loading={mutation.isPending}
          error={mutation.error ? "Summarisation failed. Please try again in a moment." : null}
          output={mutation.data?.text}
          emptyHint="Paste at least a few lines of notes to get a summary, decisions and an action table."
        />
      </div>
    </AppShell>
  );
}
