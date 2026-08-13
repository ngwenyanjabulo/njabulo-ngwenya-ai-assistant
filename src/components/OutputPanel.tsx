import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Disclaimer } from "@/components/AppShell";

export function OutputPanel({
  title,
  loading,
  error,
  output,
  emptyHint,
}: {
  title: string;
  loading: boolean;
  error?: string | null;
  output?: string | null;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Card className="shadow-card">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {output && !loading && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(output);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Generating a professional draft…
            </p>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}

        {!loading && error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        {!loading && !error && !output && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-brand-soft text-brand">
              <Sparkles className="size-5" />
            </span>
            <p className="max-w-sm text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}

        {!loading && output && <div className="prose-ai">{<ReactMarkdown>{output}</ReactMarkdown>}</div>}

        <Disclaimer />
      </CardContent>
    </Card>
  );
}
