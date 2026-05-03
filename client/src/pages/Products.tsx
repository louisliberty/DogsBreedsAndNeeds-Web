import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  Sparkles,
  ExternalLink,
  Leaf,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { productCategories } from "@shared/schema";
import type { Product } from "@shared/schema";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

function PriceTier({ tier }: { tier: string | null }) {
  if (!tier) return null;
  return (
    <span
      className="font-mono text-xs text-muted-foreground"
      data-testid={`price-tier`}
      title={
        tier === "$"
          ? "Budget-friendly"
          : tier === "$$"
            ? "Mid-range"
            : "Premium"
      }
    >
      <span className="text-foreground font-semibold">{tier}</span>
      <span className="opacity-30">{"$$$".slice(tier.length)}</span>
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const primaryRetailer = product.retailers?.[0];
  const ctaUrl =
    primaryRetailer?.url || product.linkPlaceholder || "#";
  const ctaLabel = primaryRetailer?.retailer
    ? `View on ${primaryRetailer.retailer}`
    : "View product";

  return (
    <Card
      className="flex flex-col h-full overflow-hidden"
      data-testid={`card-product-${product.id}`}
    >
      <div className="aspect-[4/3] bg-muted/40 border-b flex items-center justify-center text-muted-foreground/40">
        {product.imageUrl ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <ShoppingBag className="h-10 w-10" />
        )}
      </div>
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <div className="flex items-center gap-2">
            {product.editorsPick && (
              <Badge
                className="text-xs gap-1 bg-primary/10 text-primary border-primary/30 hover:bg-primary/15"
                variant="outline"
                data-testid={`badge-editors-pick-${product.id}`}
              >
                <Sparkles className="h-3 w-3" />
                Editor's Pick
              </Badge>
            )}
            <PriceTier tier={product.priceTier} />
          </div>
        </div>

        {product.brand && (
          <p
            className="text-xs uppercase tracking-wide text-muted-foreground mb-1"
            data-testid={`text-brand-${product.id}`}
          >
            {product.brand}
          </p>
        )}
        <h3
          className="font-semibold text-base leading-snug mb-2"
          data-testid={`text-product-name-${product.id}`}
        >
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {product.description}
        </p>

        {product.bestFor && product.bestFor.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-foreground mb-1.5">
              Best for
            </p>
            <div className="flex flex-wrap gap-1">
              {product.bestFor.slice(0, 3).map((b) => (
                <Badge key={b} variant="secondary" className="text-xs">
                  {b}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t mt-auto space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">
              {product.editorsPick ? "Why we picked it: " : "Why we recommend: "}
            </span>
            {product.editorsNote || product.whyRecommended}
          </p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground border rounded px-1.5 py-0.5"
                  data-testid={`tag-${product.id}-${t}`}
                >
                  <Leaf className="h-2.5 w-2.5" />
                  {t}
                </span>
              ))}
            </div>
          )}

          <Button
            asChild
            size="sm"
            className="w-full"
            data-testid={`button-cta-${product.id}`}
          >
            <a
              href={ctaUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
            >
              {ctaLabel}
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </a>
          </Button>
          <Link
            href="/products/how-we-choose"
            className="block text-[11px] text-center text-muted-foreground hover:text-foreground"
            data-testid={`link-how-we-choose-${product.id}`}
          >
            How we choose products
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Products() {
  useCanonical("/products");
  usePageMeta(
    "Eco-Friendly Dog Products: Vet-Reviewed Picks | Dog Breeds & Needs",
    "Clean, vet-reviewed dog product picks for food, toys, leashes, grooming, beds, and supplements. Transparent ingredients, traceable materials, and an honest affiliate disclosure.",
  );
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const editorsPicks = useMemo(
    () => (products || []).filter((p) => p.editorsPick).slice(0, 6),
    [products],
  );
  const filtered = useMemo(
    () =>
      selectedCategory
        ? (products || []).filter((p) => p.category === selectedCategory)
        : products || [],
    [products, selectedCategory],
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-6">
          <ShoppingBag className="h-12 w-12 mx-auto text-primary mb-3" />
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            data-testid="text-products-title"
          >
            Vet-reviewed picks. No mystery ingredients. No mystery materials.
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A small, opinionated list of dog products we'd actually buy — chosen
            for ingredient transparency, durable materials, and brands that
            stand behind what they sell.
          </p>
        </div>

        {/* FTC Disclosure */}
        <Card className="mb-8 border-primary/20 bg-primary/5" data-testid="banner-ftc-disclosure">
          <CardContent className="p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="text-foreground">
                <span className="font-semibold">Affiliate disclosure: </span>
                Some links below are affiliate links and we may earn a
                commission if you buy — at no extra cost to you. Editorial
                picks come first; affiliate status never decides what's listed.{" "}
                <Link
                  href="/products/how-we-choose"
                  className="underline underline-offset-2 hover:text-primary"
                  data-testid="link-disclosure-how-we-choose"
                >
                  How we choose products →
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Editor's Picks strip */}
        {!isLoading && editorsPicks.length > 0 && (
          <section className="mb-10" data-testid="section-editors-picks">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Editor's Picks</h2>
              <span className="text-xs text-muted-foreground">
                · Things we've tested and would recommend without hesitation
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {editorsPicks.map((p) => (
                <ProductCard key={`pick-${p.id}`} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Category chips */}
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xl font-semibold">Browse by category</h2>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={selectedCategory === "" ? "default" : "outline"}
            className="cursor-pointer text-sm px-4 py-1.5 hover-elevate active-elevate-2"
            onClick={() => setSelectedCategory("")}
            data-testid="filter-category-all"
          >
            All
          </Badge>
          {productCategories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer text-sm px-4 py-1.5 hover-elevate active-elevate-2"
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? "" : cat)
              }
              data-testid={`filter-category-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16" data-testid="empty-products">
            <Info className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-2">
              Nothing in this category yet
            </h3>
            <p className="text-muted-foreground text-sm">
              We're adding picks slowly and only when we'd genuinely recommend
              them. Try another category for now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
