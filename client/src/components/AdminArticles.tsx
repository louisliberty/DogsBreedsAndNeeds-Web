import { useQuery, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Pencil, Trash2, Save, X, Plus, FileText, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { articleCategories, type Article, type InsertArticle, type ArticleCategory } from "@shared/schema";

interface Props {
  authToken: string;
}

type Draft = Partial<InsertArticle> & { id?: number };

const blankDraft: Draft = {
  slug: "",
  title: "",
  metaDescription: "",
  content: "",
  category: "Lifestyle",
  tags: [],
  author: "Dog Breeds & Needs Editorial",
  publishedAt: null,
  featuredImage: "",
};

export default function AdminArticles({ authToken }: Props) {
  const { toast } = useToast();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", "all"],
    queryFn: async () => {
      const res = await fetch("/api/articles?all=1", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Failed to load articles");
      return res.json();
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (draft: Draft) => {
      const isUpdate = !!draft.id;
      const url = isUpdate ? `/api/admin/articles/${draft.id}` : "/api/admin/articles";
      const method = isUpdate ? "PUT" : "POST";
      const { id: _id, ...payload } = draft;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to save");
      }
      return res.json() as Promise<Article>;
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setEditing({ ...saved, tags: saved.tags ?? [], category: saved.category as ArticleCategory });
      setIsNew(false);
      toast({ title: "Article saved" });
    },
    onError: (err: Error) => {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setEditing(null);
      toast({ title: "Article deleted" });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  const sorted = useMemo(() => {
    if (!articles) return [];
    return [...articles].sort((a, b) => {
      const aPub = !!a.publishedAt;
      const bPub = !!b.publishedAt;
      if (aPub !== bPub) return aPub ? 1 : -1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [articles]);

  const startNew = () => {
    setEditing({ ...blankDraft });
    setIsNew(true);
  };
  const startEdit = (a: Article) => {
    setEditing({ ...a, tags: a.tags ?? [], featuredImage: a.featuredImage ?? "", category: a.category as ArticleCategory });
    setIsNew(false);
  };
  const set = (patch: Partial<Draft>) => setEditing((d) => (d ? { ...d, ...patch } : d));

  const togglePublish = () => {
    if (!editing) return;
    set({ publishedAt: editing.publishedAt ? null : new Date() });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold" data-testid="text-articles-title">Article Management</h2>
          <p className="text-sm text-muted-foreground">
            {articles?.length || 0} articles · {articles?.filter((a) => a.publishedAt).length || 0} published
          </p>
        </div>
        <Button onClick={startNew} data-testid="button-new-article">
          <Plus className="h-4 w-4 mr-2" /> New Article
        </Button>
      </div>

      {editing && (
        <Card className="mb-6 border-primary" data-testid="card-edit-article">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <CardTitle data-testid="text-edit-article-heading">
                  {isNew ? "New Article" : `Editing: ${editing.title || "(untitled)"}`}
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  {editing.publishedAt ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white" data-testid="badge-publish-status">
                      <Eye className="h-3 w-3 mr-1" /> Published
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-500 text-amber-600" data-testid="badge-publish-status">
                      <EyeOff className="h-3 w-3 mr-1" /> Draft
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)} data-testid="button-close-article-edit">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editing.title ?? ""}
                  onChange={(e) => set({ title: e.target.value })}
                  data-testid="input-article-title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug (URL)</label>
                <Input
                  value={editing.slug ?? ""}
                  onChange={(e) => set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                  placeholder="my-article-slug"
                  data-testid="input-article-slug"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full h-9 rounded-md border bg-background px-2 text-sm"
                  value={editing.category ?? "Lifestyle"}
                  onChange={(e) => set({ category: e.target.value as Draft["category"] })}
                  data-testid="select-article-category"
                >
                  {articleCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Author</label>
                <Input
                  value={editing.author ?? ""}
                  onChange={(e) => set({ author: e.target.value })}
                  data-testid="input-article-author"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Featured Image URL (optional)</label>
                <Input
                  value={editing.featuredImage ?? ""}
                  onChange={(e) => set({ featuredImage: e.target.value })}
                  placeholder="https://..."
                  data-testid="input-article-image"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={(editing.tags ?? []).join(", ")}
                  onChange={(e) => set({ tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  placeholder="apartment, small dogs, city"
                  data-testid="input-article-tags"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Meta Description (SEO)</label>
              <Textarea
                value={editing.metaDescription ?? ""}
                onChange={(e) => set({ metaDescription: e.target.value })}
                rows={2}
                maxLength={300}
                data-testid="input-article-meta"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(editing.metaDescription ?? "").length} / 300 characters
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Content (Markdown)</label>
              <MarkdownEditor
                value={editing.content ?? ""}
                onChange={(v) => set({ content: v })}
                rows={20}
                testId="input-article-content"
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t flex-wrap">
              <Button
                onClick={() => editing && upsertMutation.mutate(editing)}
                disabled={upsertMutation.isPending || !editing.title || !editing.slug || !editing.content || !editing.metaDescription}
                data-testid="button-save-article"
              >
                <Save className="mr-2 h-4 w-4" />
                {upsertMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={togglePublish} data-testid="button-toggle-publish">
                {editing.publishedAt ? (
                  <><EyeOff className="mr-2 h-4 w-4" /> Unpublish</>
                ) : (
                  <><Eye className="mr-2 h-4 w-4" /> Publish</>
                )}
              </Button>
              {editing.id && (
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() => {
                    if (editing.id && confirm(`Delete "${editing.title}"?`)) {
                      deleteMutation.mutate(editing.id);
                    }
                  }}
                  data-testid="button-delete-article"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between p-3 bg-card border rounded-lg"
              data-testid={`row-article-${a.id}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate" data-testid={`text-article-row-title-${a.id}`}>{a.title}</p>
                  <div className="flex gap-1 mt-0.5 flex-wrap items-center">
                    <Badge variant="outline" className="text-xs">{a.category}</Badge>
                    {a.publishedAt ? (
                      <Badge className="text-xs bg-emerald-600 hover:bg-emerald-600 text-white">Published</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">Draft</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">/{a.slug}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => startEdit(a)} data-testid={`button-edit-article-${a.id}`}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm(`Delete "${a.title}"?`)) deleteMutation.mutate(a.id);
                  }}
                  data-testid={`button-delete-article-${a.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <p className="text-center text-muted-foreground py-8" data-testid="text-no-articles-admin">
              No articles yet. Click "New Article" to create one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
