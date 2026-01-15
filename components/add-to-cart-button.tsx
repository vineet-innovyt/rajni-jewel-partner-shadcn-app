"use client"

import { ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

interface AddToCartButtonProps extends ButtonProps {
  product: Product
}

export function AddToCartButton({ product, ...props }: AddToCartButtonProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <Button onClick={handleAddToCart} disabled={!product.inStock} {...props}>
      <ShoppingCart size={18} />
      <span>Add to Cart</span>
    </Button>
  )
}
