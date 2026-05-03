import { useEffect, useId, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Breed } from "@shared/schema";
import { getBreedImage } from "@/lib/breedImages";

interface Props {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function SearchAutocomplete({ variant = "desktop", onNavigate }: Props) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reactId = useId();
  const listboxId = `search-listbox-${reactId}`;
  const optionId = (i: number) => `search-option-${reactId}-${i}`;

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const enabled = debounced.length >= 2;
  const { data: results, isFetching } = useQuery<Breed[]>({
    queryKey: ["/api/breeds", { search: debounced, limit: "8" }],
    queryFn: async () => {
      const res = await fetch(`/api/breeds?search=${encodeURIComponent(debounced)}&limit=8`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled,
  });

  useEffect(() => {
    setActiveIndex(-1);
  }, [debounced]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items = results ?? [];
  const seeAllItem = enabled ? { kind: "see-all" as const } : null;
  const totalItems = items.length + (seeAllItem ? 1 : 0);

  const go = (path: string) => {
    setOpen(false);
    setQuery("");
    setDebounced("");
    onNavigate?.();
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (totalItems === 0 ? -1 : (i + 1) % totalItems));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (totalItems === 0 ? -1 : (i - 1 + totalItems) % totalItems));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < items.length) {
        go(`/breeds/${items[activeIndex].slug}`);
      } else if (activeIndex === items.length && seeAllItem) {
        go(`/breeds?search=${encodeURIComponent(debounced)}`);
      } else if (enabled) {
        go(`/breeds?search=${encodeURIComponent(debounced)}`);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const widthClass = variant === "desktop" ? "w-full md:w-56 lg:w-72" : "w-full";

  return (
    <div ref={containerRef} className={`relative ${widthClass}`} data-testid={`search-autocomplete-${variant}`}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search 205 breeds…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-8 h-9"
          aria-label="Search dog breeds"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          role="combobox"
          data-testid={`input-search-${variant}`}
        />
      </div>

      {open && enabled && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 left-0 right-0 max-h-96 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-lg"
          data-testid="search-dropdown"
        >
          {isFetching && items.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground" data-testid="search-loading">Searching…</div>
          )}
          {!isFetching && items.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground" data-testid="search-empty">No breeds match "{debounced}".</div>
          )}
          {items.map((breed, i) => {
            const active = i === activeIndex;
            const img = getBreedImage(breed.slug);
            return (
              <button
                key={breed.slug}
                id={optionId(i)}
                role="option"
                aria-selected={active}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => go(`/breeds/${breed.slug}`)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent ${active ? "bg-accent" : ""}`}
                data-testid={`search-result-${breed.slug}`}
              >
                <div className="w-10 h-10 rounded-md bg-muted overflow-hidden shrink-0">
                  {img ? (
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{breed.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{breed.breedGroup} Group · {breed.sizeCategory}</div>
                </div>
              </button>
            );
          })}
          {seeAllItem && (
            <button
              id={optionId(items.length)}
              role="option"
              aria-selected={activeIndex === items.length}
              onMouseEnter={() => setActiveIndex(items.length)}
              onClick={() => go(`/breeds?search=${encodeURIComponent(debounced)}`)}
              className={`w-full px-3 py-2 text-left text-sm border-t hover:bg-accent ${activeIndex === items.length ? "bg-accent" : ""}`}
              data-testid="search-see-all"
            >
              See all results for "<span className="font-medium">{debounced}</span>"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
