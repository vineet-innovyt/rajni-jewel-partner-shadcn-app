"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, type FilterState } from "@/components/product-filters";
import { Header } from "@/components/header";
import { useCart } from "@/lib/cart-context";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { productSearchApi } from "@/services/rajni-apis";

export function ProductsContent() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const searchParams = useSearchParams();
  const qsCategory = searchParams.get("category")?.trim().toLowerCase();

  const [filters, setFilters] = useState<FilterState>({
    categoryIds: [],
    subcategory: "",
    typeIds: [],
    searchQuery: "",
    priceRange: [0, 20000],
  });

  const {
    data: searchResult,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.Products],
    queryFn: () => productSearchApi(0, 500),
  });

  const products = searchResult ? searchResult.items : [];

  useEffect(() => {
    if (qsCategory) {
      let categoryId = "";
      for (const product of products) {
        const match = product.categories?.find((c) =>
          c.value?.toLowerCase().includes(qsCategory),
        );
        if (match) {
          categoryId = match.code as string;
          break;
        }
      }
      if (categoryId) {
        setFilters({
          ...filters,
          categoryIds: [categoryId],
        });
      }
    }
  }, [qsCategory, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productCategoryIds =
        product.categories?.map((o) => o.code as string) || [];
      if (
        filters.categoryIds?.length &&
        !filters.categoryIds.some((o) => productCategoryIds.includes(o))
      )
        return false;
      // if (filters.subcategory && product.subcategory !== filters.subcategory)
      //   return false;
      if (
        filters.typeIds?.length &&
        !filters.typeIds.includes(product.type?.code as string)
      )
        return false;
      if (filters.searchQuery?.trim().length) {
        const query = filters.searchQuery.toLowerCase();
        if (
          !product.name?.toLowerCase().includes(query) &&
          !product.description?.toLowerCase().includes(query) &&
          !product.tags?.join(" ")?.toLowerCase().includes(query) &&
          !product.sku?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      // if (
      //   product.price < filters.priceRange[0] ||
      //   product.price > filters.priceRange[1]
      // )
      //   return false;
      return true;
    });
  }, [products, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <span className="text-balance">Our Collection</span>
          </h1>
          <p className="text-muted-foreground">
            Explore our carefully curated selection of luxury jewelry
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-card border border-border rounded-lg p-4">
              <ProductFilters
                products={products}
                filters={filters}
                onFilterChange={setFilters}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No products found matching your criteria.
                </p>
                <Button
                  onClick={() =>
                    setFilters({
                      categoryIds: [],
                      subcategory: "",
                      typeIds: [],
                      searchQuery: "",
                      priceRange: [0, 20000],
                    })
                  }
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
