import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Shield, Search, Pencil, Trash2, LogIn, LogOut, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Breed } from "@shared/schema";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Admin() {
  useCanonical("/admin");
  usePageMeta(
    "Admin – Breed Management | Dog Breeds & Needs",
    "Admin panel for managing dog breed data on Dog Breeds & Needs."
  );
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBreed, setEditingBreed] = useState<Breed | null>(null);
  const [editData, setEditData] = useState<Partial<Breed>>({});
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
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/breeds"] });
      setEditingBreed(null);
      setEditData({});
      toast({ title: "Breed updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update breed", variant: "destructive" });
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
      queryClient.invalidateQueries({ queryKey: ["/api/breeds"] });
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

  const filtered = breeds?.filter(
    (b) => !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-admin-title">Breed Management</h1>
            <p className="text-sm text-muted-foreground">{breeds?.length || 0} breeds in database</p>
          </div>
          <Button
            variant="outline"
            onClick={() => { setAuthed(false); setAuthToken(""); setPassword(""); }}
            data-testid="button-admin-logout"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

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

        {editingBreed && (
          <Card className="mb-6 border-primary" data-testid="card-edit-breed">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Editing: {editingBreed.name}</span>
                <Button variant="ghost" size="icon" onClick={() => { setEditingBreed(null); setEditData({}); }}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editData.name ?? editingBreed.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    data-testid="input-edit-name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Breed Group</label>
                  <Input
                    value={editData.breedGroup ?? editingBreed.breedGroup}
                    onChange={(e) => setEditData({ ...editData, breedGroup: e.target.value })}
                    data-testid="input-edit-group"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Size Category</label>
                  <Input
                    value={editData.sizeCategory ?? editingBreed.sizeCategory}
                    onChange={(e) => setEditData({ ...editData, sizeCategory: e.target.value })}
                    data-testid="input-edit-size"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Energy Level</label>
                  <Input
                    value={editData.energyLevel ?? editingBreed.energyLevel}
                    onChange={(e) => setEditData({ ...editData, energyLevel: e.target.value })}
                    data-testid="input-edit-energy"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Temperament Summary</label>
                <Textarea
                  value={editData.temperamentSummary ?? editingBreed.temperamentSummary}
                  onChange={(e) => setEditData({ ...editData, temperamentSummary: e.target.value })}
                  data-testid="input-edit-temperament"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Fun Fact</label>
                <Textarea
                  value={editData.funFact ?? editingBreed.funFact}
                  onChange={(e) => setEditData({ ...editData, funFact: e.target.value })}
                  data-testid="input-edit-funfact"
                />
              </div>
              <Button
                onClick={() => updateMutation.mutate({ id: editingBreed.id, data: editData })}
                disabled={updateMutation.isPending}
                data-testid="button-save-breed"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
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
            {filtered?.map((breed) => (
              <div
                key={breed.id}
                className="flex items-center justify-between p-3 bg-card border rounded-lg"
                data-testid={`row-breed-${breed.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-muted-foreground w-8">#{breed.popularity}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{breed.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      <Badge variant="outline" className="text-xs">{breed.breedGroup}</Badge>
                      <Badge variant="outline" className="text-xs">{breed.sizeCategory}</Badge>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
