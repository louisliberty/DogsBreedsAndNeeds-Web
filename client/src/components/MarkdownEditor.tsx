import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (/^(https?:|mailto:|\/|#)/i.test(trimmed)) return trimmed;
  return "#";
}

function inline(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
    return `<a href="${escapeHtml(safeUrl(url))}" class="underline text-primary" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-muted rounded text-xs">$1</code>');
  return out;
}

export function renderMarkdown(md: string): string {
  if (!md) return "";
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      out.push(`<p class="mb-3 leading-relaxed">${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const closeList = () => {
    if (inList) { out.push("</ul>"); inList = false; }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      closeList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara(); closeList();
      out.push(`<h3 class="text-base font-semibold mt-4 mb-2">${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      flushPara(); closeList();
      out.push(`<h2 class="text-lg font-bold mt-4 mb-2">${inline(line.slice(3))}</h2>`);
    } else if (line.match(/^- /)) {
      flushPara();
      if (!inList) { out.push('<ul class="list-disc pl-5 mb-3 space-y-1">'); inList = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else {
      closeList();
      para.push(line);
    }
  }
  flushPara();
  closeList();
  return out.join("\n");
}

export function wordCount(s: string | null | undefined): number {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  minWords?: number;
  rows?: number;
  testId?: string;
}

export function MarkdownEditor({ value, onChange, minWords, rows = 6, testId }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const wc = wordCount(value);
  const meets = !minWords || wc >= minWords;

  return (
    <div className="border rounded-md">
      <Tabs value={tab} onValueChange={(v) => setTab(v as "edit" | "preview")}>
        <div className="flex items-center justify-between px-2 py-1 border-b bg-muted/40">
          <TabsList className="h-7">
            <TabsTrigger value="edit" className="text-xs h-6 px-2" data-testid={testId ? `${testId}-tab-edit` : undefined}>Edit</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs h-6 px-2" data-testid={testId ? `${testId}-tab-preview` : undefined}>Preview</TabsTrigger>
          </TabsList>
          {minWords ? (
            <span className={`text-xs ${meets ? "text-muted-foreground" : "text-destructive font-medium"}`}>
              {wc} / {minWords} words {meets ? "✓" : ""}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">{wc} words</span>
          )}
        </div>
        <TabsContent value="edit" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="border-0 rounded-t-none focus-visible:ring-0 font-mono text-sm"
            placeholder="Markdown supported: ## heading, **bold**, *italic*, - list, [link](url)"
            data-testid={testId}
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-0">
          <div
            className="prose prose-sm max-w-none p-3 min-h-32 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="text-muted-foreground italic">Nothing to preview yet.</p>' }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
