import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, Send, Sparkles } from "lucide-react";
import { AppShell, Disclaimer } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { runChat, type ChatMessage } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant Chat | Aster Workplace AI" },
      {
        name: "description",
        content:
          "Chat with a workplace productivity assistant for drafting, planning and decision support.",
      },
      { property: "og:title", content: "AI Assistant Chat | Aster Workplace AI" },
      {
        property: "og:description",
        content: "A conversational assistant for everyday professional work.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Help me prepare for a difficult performance conversation",
  "Turn this update into a 3-bullet status for leadership",
  "What should I ask in a vendor evaluation call?",
];

function ChatPage() {
  const chat = useServerFn(runChat);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError(null);
    setPending(true);
    try {
      const res = await chat({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch {
      setError("The assistant could not respond. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AppShell
      title="AI Assistant Chat"
      description="Ask anything about your work — drafting, planning or decision support."
    >
      <Card className="flex h-[calc(100vh-11rem)] flex-col overflow-hidden p-0 shadow-card">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <span className="grid size-11 place-items-center rounded-full bg-brand-soft text-brand">
                <Sparkles className="size-5" />
              </span>
              <p className="max-w-sm text-sm text-muted-foreground">
                Start a conversation with Aster. It keeps the full thread in context.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-brand-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "prose-ai max-w-[90%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-3"
                }
              >
                {m.role === "user" ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
              </div>
            </div>
          ))}

          {pending && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Aster is thinking…
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div ref={endRef} />
        </div>

        <div className="space-y-2 border-t border-border bg-card px-4 py-3 sm:px-6">
          <div className="flex items-end gap-2">
            <Textarea
              rows={1}
              value={input}
              placeholder="Ask Aster something…"
              className="max-h-40 min-h-11 resize-none"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
            />
            <Button size="icon" disabled={!input.trim() || pending} onClick={() => void send(input)}>
              <Send className="size-4" />
            </Button>
          </div>
          <Disclaimer />
        </div>
      </Card>
    </AppShell>
  );
}
