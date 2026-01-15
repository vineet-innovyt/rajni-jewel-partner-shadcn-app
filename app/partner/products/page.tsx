"use client"

import { Suspense } from "react"
import { ProductsContent } from "@/components/products-content"

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
