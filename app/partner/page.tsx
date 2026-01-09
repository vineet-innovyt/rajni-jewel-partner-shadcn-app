"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { CategoryTiles } from "@/components/category-tiles";
import { ProductCarousel } from "@/components/product-carousel";
import { Header } from "@/components/header";
import { categories } from "@/lib/products-data";
import { products } from "@/lib/products-data";

export default function Page() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, isLoading, router]);

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

  const bestSellingProducts = products.filter((p) => p.bestSeller);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            <span className="text-balance">Welcome to Jewel</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our exquisite collection of luxury jewelry, crafted with
            precision and elegance for every occasion.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Best Sellers Carousel */}
        <ProductCarousel products={bestSellingProducts} title="Best Sellers" />

        {/* Category Tiles */}
        <CategoryTiles categories={categories} />

        {/* CTA Section */}
        <section className="bg-card border border-border rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            <span className="text-balance">Timeless Elegance Awaits</span>
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Each piece in our collection is carefully selected to represent the
            finest in luxury craftsmanship and design.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
          >
            Shop Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Jewel. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition">
                Terms
              </Link>
              <Link href="#" className="hover:text-primary transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
