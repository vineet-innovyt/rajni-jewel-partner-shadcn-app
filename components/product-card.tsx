"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { ProductEntity } from "@/services/entities";
import { PARTNER_PRODUCTS_PAGE } from "@/lib/constants";

interface ProductCardProps {
  product: ProductEntity;
  onAddToCart: (product: ProductEntity) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { items, updateQuantity, removeFromCart } = useCart();

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition group">
      <Link
        href={`${PARTNER_PRODUCTS_PAGE}/${product.id}`}
        className="relative block"
      >
        <div className="aspect-square relative bg-secondary overflow-hidden">
          <Image
            src={product.images?.[0]?.url || "/placeholder.svg"}
            alt={product.name as string}
            fill
            className="object-cover group-hover:scale-110 transition duration-500"
          />

          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Best Seller
          </div>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-primary">&nbsp;</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-9 w-9 hidden"
              title="Add to wishlist"
            >
              <Heart size={16} />
            </Button>

            {quantity > 0 ? (
              <div className="flex items-center gap-1 bg-secondary rounded-lg px-2">
                <Button
                  onClick={handleDecrement}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-7 w-7 hover:bg-background"
                >
                  <Minus size={14} />
                </Button>
                <span className="text-sm font-semibold w-6 text-center">
                  {quantity}
                </span>
                <Button
                  onClick={handleIncrement}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-7 w-7 hover:bg-background"
                >
                  <Plus size={14} />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onAddToCart(product)}
                size="sm"
                className="flex items-center gap-1"
              >
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">Add</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
