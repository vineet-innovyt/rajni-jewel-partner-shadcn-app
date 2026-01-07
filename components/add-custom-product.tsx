"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

export function AddCustomProduct() {
  const { addCustomToCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [productName, setProductName] = useState("")
  const [variant, setVariant] = useState("")
  const [quantity, setQuantity] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (productName.trim() && variant.trim()) {
      addCustomToCart(productName.trim(), variant.trim(), quantity)
      // Reset form
      setProductName("")
      setVariant("")
      setQuantity(1)
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-secondary text-foreground py-3 rounded-lg hover:opacity-80 transition font-medium flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Custom Product
      </button>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-foreground">Add Custom Product</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-secondary rounded transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product-name" className="block text-sm font-medium text-foreground mb-2">
            Product Name *
          </label>
          <Input
            id="product-name"
            placeholder="e.g., Custom Pendant, Bracelet, etc."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="variant" className="block text-sm font-medium text-foreground mb-2">
            Variant (Color, Size, Material, etc.) *
          </label>
          <Input
            id="variant"
            placeholder="e.g., Rose Gold, Size 7, 18K Gold, etc."
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-foreground mb-2">
            Quantity
          </label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:opacity-90">
            Add to Cart
          </Button>
          <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
