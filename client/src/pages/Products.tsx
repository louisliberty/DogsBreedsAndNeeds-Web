import { useQuery } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { productCategories } from "@shared/schema";
import type { Product } from "@shared/schema";
import { useCanonical } from "@/hooks/useCanonical";

export default function Products() {
  useCanonical("/products");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filtered = selectedCategory
    ? products?.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <ShoppingBag className="h-12 w-12 mx-auto text-primary mb-3" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" data-testid="text-products-title">
            Recommended Products
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Curated products for your dog's health, happiness, and well-being. All recommendations are based on quality, safety, and value.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Badge
            variant={selectedCategory === "" ? "default" : "outline"}
            className="cursor-pointer text-sm px-4 py-1.5"
            onClick={() => setSelectedCategory("")}
            data-testid="filter-category-all"
          >
            All
          </Badge>
          {productCategories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer text-sm px-4 py-1.5"
              onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              data-testid={`filter-category-${cat.toLowerCase()}`}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered?.map((product) => (
              <Card key={product.id} data-testid={`card-product-${product.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline">{product.category}</Badge>
                    {product.sponsored && (
                      <Badge variant="secondary" className="text-xs">Sponsored</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-base mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2">
                      <span className="font-medium text-foreground">Why we recommend:</span> {product.whyRecommended}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {product.suitableSizes.split(",").map((size) => (
                        <Badge key={size} variant="secondary" className="text-xs">
                          {size.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filtered?.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
