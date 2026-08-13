import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { runAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Aster Workplace AI" },
      {
        name: "description",
        content:
          "Rank your task list by impact and urgency, then get a realistic schedule that fits your focus hours.",
      },
      { property: "og:title", content: "AI Task Planner | Aster Workplace AI" },
      {
        property: "og:description",
        content: "Prioritisation and scheduling that respects your real capacity.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(runAssistant);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("Today");
  const [hours, setHours] = useState([5]);

  const mutation = useMutation({
    mutationFn: () =>
      run({
        data: {
          kind: "planner" as const,
          tasks,
          horizon,
          hoursPerDay: String(hours[0]),
        },
      }),
  });

  return (
    <AppShell
      title="AI Task Planner"
      description="Prioritise by impact and urgency, then schedule against real capacity."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="tasks">One task per line (add deadlines if known)</Label>
              <Textarea
                id="tasks"
                rows={12}
                placeholder={"Finish board deck — due Friday\nReview 3 PRs\nCall supplier about delayed order"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Planning horizon</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Today", "Next 3 days", "This week", "Next two weeks"].map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Focus hours available per day: {hours[0]}h</Label>
              <Slider min={1} max={10} step={1} value={hours} onValueChange={setHours} />
            </div>

            <Button
              className="w-full"
              disabled={tasks.trim().length < 5 || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              <Wand2 className="size-4" />
              {mutation.isPending ? "Planning…" : "Build my plan"}
            </Button>
          </CardContent>
        </Card>

        <OutputPanel
          title="Prioritised plan"
          loading={mutation.isPending}
          error={mutation.error ? "Planning failed. Please try again in a moment." : null}
          output={mutation.data?.text}
          emptyHint="Add your tasks to get a ranked priority table, a schedule, quick wins and delegation candidates."
        />
      </div>
    </AppShell>
  );
}
