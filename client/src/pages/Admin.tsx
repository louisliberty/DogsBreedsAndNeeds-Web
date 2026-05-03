import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Shield, Search, Pencil, Trash2, LogIn, LogOut, Save, X, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Breed } from "@shared/schema";
import { computeCompletenessScore, CONTENT_FIELD_MINIMUMS, contentQualityLevels } from "@shared/schema";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useRobots } from "@/hooks/useRobots";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import AdminArticles from "@/components/AdminArticles";

function qualityVariant(q: string): { variant: "default" | "secondary" | "outline" | "destructive"; label: string; className: string } {
  switch (q) {
    case "verified": return { variant: "default", label: "Verified", className: "bg-emerald-600 hover:bg-emerald-600 text-white" };
    case "reviewed": return { variant: "default", label: "Reviewed", className: "bg-blue-600 hover:bg-blue-600 text-white" };
    case "draft": return { variant: "secondary", label: "Draft", className: "" };
    default: return { variant: "outline", label: "Templated", className: "border-amber-500 text-amber-600" };
  }
}

export default function Admin() {
  useCanonical("/admin");
  useRobots("noindex, follow");
  usePageMeta(
    "Admin: Breed Management | Dog Breeds & Needs",
    "Admin panel for managing dog breed data on Dog Breeds & Needs."
  );
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [qualityFilter, setQualityFilter] = useState<string>("all");
  const [editingBreed, setEditingBreed] = useState<Breed | null>(null);
  const [editData, setEditData] = useState<Partial<Breed>>({});
  const [section, setSection] = useState<"breeds" | "articles">("breeds");
  const { toast } = useToast();

  const { data: breeds, isLoading } = useQuery<Breed[]>({
    queryKey: ["/api/breeds"],
    enabled: authed,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Breed> }) => {
      const res = await fetch(`/api/admin/breeds/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to update");
      }
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        predicate: (q) => typeof q.queryKey[0] === "string" && (q.queryKey[0] as string).startsWith("/api/breeds"),
      });
      setEditingBreed(updated);
      setEditData({});
      toast({ title: "Breed updated successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update breed", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/breeds/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (q) => typeof q.queryKey[0] === "string" && (q.queryKey[0] as string).startsWith("/api/breeds"),
      });
      toast({ title: "Breed deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete breed", variant: "destructive" });
    },
  });

  const handleLogin = async () => {
    try {
      const res = await apiRequest("POST", "/api/admin/login", { password });
      if (res.ok) {
        setAuthed(true);
        setAuthToken(password);
        toast({ title: "Logged in successfully" });
      }
    } catch {
      toast({ title: "Invalid password", variant: "destructive" });
    }
  };

  const filtered = useMemo(() => {
    if (!breeds) return [];
    return breeds.filter((b) => {
      if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (qualityFilter !== "all" && b.contentQuality !== qualityFilter) return false;
      return true;
    });
  }, [breeds, searchQuery, qualityFilter]);

  const stats = useMemo(() => {
    if (!breeds) return null;
    const counts: Record<string, number> = { templated: 0, draft: 0, reviewed: 0, verified: 0 };
    let totalScore = 0;
    for (const b of breeds) {
      counts[b.contentQuality] = (counts[b.contentQuality] || 0) + 1;
      totalScore += computeCompletenessScore(b).score;
    }
    return { counts, avgScore: Math.round(totalScore / breeds.length) };
  }, [breeds]);

  if (!authed) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-sm mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto text-primary mb-3" />
              <CardTitle data-testid="text-admin-login-title">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                data-testid="input-admin-password"
              />
              <Button className="w-full" onClick={handleLogin} data-testid="button-admin-login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const current = editingBreed
    ? ({ ...editingBreed, ...editData } as Breed)
    : null;
  const completeness = current ? computeCompletenessScore(current) : null;

  const get = <K extends keyof Breed>(k: K): Breed[K] => (editData[k] ?? editingBreed?.[k]) as Breed[K];
  const set = (patch: Partial<Breed>) => setEditData((prev) => ({ ...prev, ...patch }));

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-admin-title">Breed Management</h1>
            <p className="text-sm text-muted-foreground">
              {breeds?.length || 0} breeds in database
              {stats && (
                <> · avg completeness <span className="font-medium text-foreground">{stats.avgScore}%</span></>
              )}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => { setAuthed(false); setAuthToken(""); setPassword(""); setEditingBreed(null); }}
            data-testid="button-admin-logout"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setSection("breeds")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${section === "breeds" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            data-testid="tab-section-breeds"
          >
            Breeds
          </button>
          <button
            onClick={() => setSection("articles")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${section === "articles" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            data-testid="tab-section-articles"
          >
            Articles
          </button>
        </div>

        {section === "articles" && <AdminArticles authToken={authToken} />}

        {section === "breeds" && (<>

        {stats && (
          <div className="flex flex-wrap gap-2 mb-4" data-testid="stats-content-quality">
            {(["all", ...contentQualityLevels] as const).map((q) => {
              const count = q === "all" ? (breeds?.length || 0) : (stats.counts[q] || 0);
              const label = q === "all" ? "All" : qualityVariant(q).label;
              const active = qualityFilter === q;
              return (
                <Button
                  key={q}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => setQualityFilter(q)}
                  data-testid={`filter-quality-${q}`}
                  className="h-7 text-xs"
                >
                  {label} <span className="ml-1.5 opacity-70">({count})</span>
                </Button>
              );
            })}
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search breeds..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-admin-search"
          />
        </div>

        {editingBreed && current && (
          <Card className="mb-6 border-primary" data-testid="card-edit-breed">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <CardTitle>Editing: {editingBreed.name}</CardTitle>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      className={qualityVariant(current.contentQuality).className}
                      variant={qualityVariant(current.contentQuality).variant}
                      data-testid="badge-edit-quality"
                    >
                      {qualityVariant(current.contentQuality).label}
                    </Badge>
                    {completeness && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Completeness:</span>
                        <Progress value={completeness.score} className="w-32 h-2" />
                        <span className="font-medium" data-testid="text-completeness-score">{completeness.score}%</span>
                      </div>
                    )}
                    {current.reviewedBy && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Reviewed by {current.reviewedBy}
                      </span>
                    )}
                    {current.lastUpdated && (
                      <span className="text-xs text-muted-foreground" data-testid="text-last-updated">
                        Last updated: {new Date(current.lastUpdated).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setEditingBreed(null); setEditData({}); }} data-testid="button-close-edit">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input value={String(get("name") ?? "")} onChange={(e) => set({ name: e.target.value })} data-testid="input-edit-name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Breed Group</label>
                  <Input value={String(get("breedGroup") ?? "")} onChange={(e) => set({ breedGroup: e.target.value })} data-testid="input-edit-group" />
                </div>
                <div>
                  <label className="text-sm font-medium">Size Category</label>
                  <Input value={String(get("sizeCategory") ?? "")} onChange={(e) => set({ sizeCategory: e.target.value })} data-testid="input-edit-size" />
                </div>
                <div>
                  <label className="text-sm font-medium">Energy Level</label>
                  <Input value={String(get("energyLevel") ?? "")} onChange={(e) => set({ energyLevel: e.target.value })} data-testid="input-edit-energy" />
                </div>
                <div>
                  <label className="text-sm font-medium">Content Quality</label>
                  <select
                    className="w-full h-9 rounded-md border bg-background px-2 text-sm"
                    value={String(get("contentQuality") ?? "templated")}
                    onChange={(e) => set({ contentQuality: e.target.value })}
                    data-testid="select-edit-quality"
                  >
                    {contentQualityLevels.map((q) => (
                      <option key={q} value={q}>{qualityVariant(q).label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Reviewed By</label>
                  <Input
                    value={String(get("reviewedBy") ?? "")}
                    onChange={(e) => set({ reviewedBy: e.target.value })}
                    placeholder="Name or initials"
                    data-testid="input-edit-reviewer"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Temperament Summary</label>
                <Textarea
                  value={String(get("temperamentSummary") ?? "")}
                  onChange={(e) => set({ temperamentSummary: e.target.value })}
                  rows={2}
                  data-testid="input-edit-temperament"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Personality Deep Dive</label>
                <MarkdownEditor
                  value={String(get("personalityDeepDive") ?? "")}
                  onChange={(v) => set({ personalityDeepDive: v })}
                  minWords={CONTENT_FIELD_MINIMUMS.personalityDeepDive}
                  rows={8}
                  testId="input-edit-personality"
                />
              </div>

              <div>
                <label className="text-sm font-medium">History</label>
                <MarkdownEditor
                  value={String(get("history") ?? "")}
                  onChange={(v) => set({ history: v })}
                  minWords={CONTENT_FIELD_MINIMUMS.history}
                  rows={6}
                  testId="input-edit-history"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Living With</label>
                <MarkdownEditor
                  value={String(get("livingWith") ?? "")}
                  onChange={(v) => set({ livingWith: v })}
                  minWords={CONTENT_FIELD_MINIMUMS.livingWith}
                  rows={6}
                  testId="input-edit-livingwith"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Health Care Guide</label>
                <MarkdownEditor
                  value={String(get("healthCareGuide") ?? "")}
                  onChange={(v) => set({ healthCareGuide: v })}
                  minWords={CONTENT_FIELD_MINIMUMS.healthCareGuide}
                  rows={6}
                  testId="input-edit-healthcare"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Training Notes</label>
                <MarkdownEditor
                  value={String(get("trainingNotes") ?? "")}
                  onChange={(v) => set({ trainingNotes: v })}
                  minWords={CONTENT_FIELD_MINIMUMS.trainingNotes}
                  rows={5}
                  testId="input-edit-training"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Diet Notes</label>
                <MarkdownEditor
                  value={String(get("dietNotes") ?? "")}
                  onChange={(v) => set({ dietNotes: v })}
                  minWords={CONTENT_FIELD_MINIMUMS.dietNotes}
                  rows={5}
                  testId="input-edit-diet"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Grooming Frequency (short factual)</label>
                <Input
                  value={String(get("groomingFrequency") ?? "")}
                  onChange={(e) => set({ groomingFrequency: e.target.value })}
                  placeholder="e.g. Weekly brushing, more during shedding season"
                  data-testid="input-edit-grooming-frequency"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Grooming Guide (long-form)</label>
                <MarkdownEditor
                  value={String(get("groomingGuide") ?? "")}
                  onChange={(v) => set({ groomingGuide: v })}
                  minWords={CONTENT_FIELD_MINIMUMS.groomingGuide}
                  rows={5}
                  testId="input-edit-grooming-guide"
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ideal Owner Profile</label>
                  <MarkdownEditor
                    value={String(get("idealOwnerProfile") ?? "")}
                    onChange={(v) => set({ idealOwnerProfile: v })}
                    minWords={CONTENT_FIELD_MINIMUMS.idealOwnerProfile}
                    rows={5}
                    testId="input-edit-ideal-owner"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Not Good For</label>
                  <MarkdownEditor
                    value={String(get("notGoodFor") ?? "")}
                    onChange={(v) => set({ notGoodFor: v })}
                    minWords={CONTENT_FIELD_MINIMUMS.notGoodFor}
                    rows={5}
                    testId="input-edit-not-good-for"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Common Misconceptions</label>
                <MarkdownEditor
                  value={String(get("commonMisconceptions") ?? "")}
                  onChange={(v) => set({ commonMisconceptions: v })}
                  minWords={CONTENT_FIELD_MINIMUMS.commonMisconceptions}
                  rows={4}
                  testId="input-edit-misconceptions"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Fun Facts (one per line, 3–5 recommended)</label>
                <Textarea
                  value={(get("funFacts") as string[] | undefined ?? []).join("\n")}
                  onChange={(e) => set({ funFacts: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                  rows={5}
                  className="font-mono text-sm"
                  data-testid="input-edit-funfacts"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(get("funFacts") as string[] | undefined ?? []).length} fact(s)
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Primary Fun Fact (legacy single field)</label>
                <Textarea
                  value={String(get("funFact") ?? "")}
                  onChange={(e) => set({ funFact: e.target.value })}
                  rows={2}
                  data-testid="input-edit-funfact"
                />
              </div>

              {completeness && completeness.missing.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md p-3 text-sm" data-testid="warning-missing-content">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-amber-900 dark:text-amber-200">Below minimum word counts:</p>
                      <p className="text-amber-800 dark:text-amber-300 mt-1">
                        {completeness.missing.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {String(get("contentQuality") ?? "") === "templated" && (
                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-md p-3 text-sm" data-testid="warning-templated-content">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-orange-900 dark:text-orange-200">Templated (auto-generated) content</p>
                      <p className="text-orange-800 dark:text-orange-300 mt-1">
                        This breed's long-form copy was produced by the seed generator and has not yet been edited by a human. Rewrite the prose with breed-specific detail, then change Quality to "Draft" or higher to remove this warning.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2 border-t">
                <Button
                  onClick={() => updateMutation.mutate({ id: editingBreed.id, data: editData })}
                  disabled={updateMutation.isPending || Object.keys(editData).length === 0}
                  data-testid="button-save-breed"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditData({})}
                  disabled={Object.keys(editData).length === 0}
                  data-testid="button-discard-changes"
                >
                  Discard Changes
                </Button>
                {Object.keys(editData).length > 0 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {Object.keys(editData).length} unsaved field(s)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((breed) => {
              const score = computeCompletenessScore(breed).score;
              const q = qualityVariant(breed.contentQuality);
              return (
                <div
                  key={breed.id}
                  className="flex items-center justify-between p-3 bg-card border rounded-lg"
                  data-testid={`row-breed-${breed.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs text-muted-foreground w-8">#{breed.popularity}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{breed.name}</p>
                      <div className="flex gap-1 mt-0.5 flex-wrap items-center">
                        <Badge variant="outline" className="text-xs">{breed.breedGroup}</Badge>
                        <Badge variant="outline" className="text-xs">{breed.sizeCategory}</Badge>
                        <Badge variant={q.variant} className={`text-xs ${q.className}`} data-testid={`badge-quality-${breed.id}`}>
                          {q.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground" data-testid={`text-score-${breed.id}`}>
                          {score}% complete
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setEditingBreed(breed); setEditData({}); }}
                      data-testid={`button-edit-${breed.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Delete ${breed.name}?`)) {
                          deleteMutation.mutate(breed.id);
                        }
                      }}
                      data-testid={`button-delete-${breed.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No breeds match your filters.</p>
            )}
          </div>
        )}
        </>)}
      </div>
    </div>
  );
}
