import { notFound } from "next/navigation"
import { products } from "@/lib/products-data"
import ProductPageClient from "./page.client.tsx"

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return <ProductPageClient />
}
