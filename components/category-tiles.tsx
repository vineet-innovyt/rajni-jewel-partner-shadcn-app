"use client";

import { PARTNER_PRODUCTS_PAGE } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoryTilesProps {
  categories: Category[];
}

export function CategoryTiles({ categories }: CategoryTilesProps) {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
        <span className="text-balance">Shop by Category</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`${PARTNER_PRODUCTS_PAGE}?category=${category.id}`}
            className="group relative overflow-hidden rounded-lg border border-border hover:border-primary transition"
          >
            <div className="aspect-square relative">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white text-center">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
