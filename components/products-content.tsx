"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { ProductFilters, type FilterState } from "@/components/product-filters"
import { Header } from "@/components/header"
import { products } from "@/lib/products-data"
import { useCart } from "@/lib/cart-context"

export function ProductsContent() {
  const { user, isLoading } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category") || "",
    subcategory: "",
    type: "",
    searchQuery: "",
    priceRange: [0, 20000],
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in")
    }
  }, [user, isLoading, router])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.category && product.category !== filters.category) return false
      if (filters.subcategory && product.subcategory !== filters.subcategory) return false
      if (filters.type && product.type !== filters.type) return false
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        if (!product.name.toLowerCase().includes(query) && !product.description.toLowerCase().includes(query)) {
          return false
        }
      }
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false
      return true
    })
  }, [filters])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <span className="text-balance">Our Collection</span>
          </h1>
          <p className="text-muted-foreground">Explore our carefully curated selection of luxury jewelry</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-card border border-border rounded-lg p-4">
              <ProductFilters filters={filters} onFilterChange={setFilters} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                <Button
                  onClick={() =>
                    setFilters({
                      category: "",
                      subcategory: "",
                      type: "",
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
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
