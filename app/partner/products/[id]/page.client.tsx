"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/product-gallery";
import { Header } from "@/components/header";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products-data";
import type { Product } from "@/lib/types";

export default function ProductPageClient_TOBEDEL() {
  const params = useParams();
  const { items, updateQuantity, removeFromCart, addToCart } = useCart();
  const [product, setProduct] = React.useState<Product | null>(null);

  React.useEffect(() => {
    const id = params?.id as string;
    if (id) {
      const foundProduct = products.find((p) => p.id === id);
      setProduct(foundProduct || null);
    }
  }, [params]);

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Product not found
            </h1>
          </div>
        </main>
      </>
    );
  }

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

  const handleAddToCart = () => {
    // addToCart(product);
  };

  const images = product.images || [product.image];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Gallery */}
            <ProductGallery images={images} productName={product.name} />

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {/* Price and Availability */}
              <div className="border-t border-b border-border py-4 space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      product.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {quantity > 0 ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Button
                      onClick={handleDecrement}
                      variant="outline"
                      size="lg"
                      className="px-4 bg-transparent"
                    >
                      <Minus size={18} />
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-xl font-bold">{quantity}</span>
                    </div>
                    <Button
                      onClick={handleIncrement}
                      variant="outline"
                      size="lg"
                      className="px-4 bg-transparent"
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    size="lg"
                    className="flex-1 gap-2"
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-transparent"
                >
                  <Share2 size={18} />
                  Share
                </Button>
              </div>

              {/* Quick Specs */}
              <div className="bg-secondary rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-foreground">Quick Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {product.productCode && (
                    <>
                      <span className="text-muted-foreground">
                        Product Code:
                      </span>
                      <span className="font-medium">{product.productCode}</span>
                    </>
                  )}
                  {product.designNumber && (
                    <>
                      <span className="text-muted-foreground">
                        Design Number:
                      </span>
                      <span className="font-medium">
                        {product.designNumber}
                      </span>
                    </>
                  )}
                  {product.shape && (
                    <>
                      <span className="text-muted-foreground">Shape:</span>
                      <span className="font-medium">{product.shape}</span>
                    </>
                  )}
                  {product.color && (
                    <>
                      <span className="text-muted-foreground">Color:</span>
                      <span className="font-medium">{product.color}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Metal Information */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Metal Information
              </h3>
              <div className="space-y-3 text-sm">
                {product.metalClarity && (
                  <div>
                    <span className="text-muted-foreground">Metal Type:</span>
                    <p className="font-medium text-foreground">
                      {product.metalClarity}
                    </p>
                  </div>
                )}
                {product.purityKarat && (
                  <div>
                    <span className="text-muted-foreground">
                      Purity (Karat):
                    </span>
                    <p className="font-medium text-foreground">
                      {product.purityKarat}
                    </p>
                  </div>
                )}
                {product.color && (
                  <div>
                    <span className="text-muted-foreground">Color:</span>
                    <p className="font-medium text-foreground">
                      {product.color}
                    </p>
                  </div>
                )}
                {product.metalValue !== undefined && (
                  <div className="border-t border-border pt-3 mt-3">
                    <span className="text-muted-foreground">Metal Value:</span>
                    <p className="font-bold text-primary">
                      ${product.metalValue.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Weight Information */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Weight Specifications
              </h3>
              <div className="space-y-3 text-sm">
                {product.grossWeightGram && (
                  <div>
                    <span className="text-muted-foreground">Gross Weight:</span>
                    <p className="font-medium text-foreground">
                      {product.grossWeightGram}g
                    </p>
                  </div>
                )}
                {product.netWeight && (
                  <div>
                    <span className="text-muted-foreground">Net Weight:</span>
                    <p className="font-medium text-foreground">
                      {product.netWeight}g
                    </p>
                  </div>
                )}
                {product.size && (
                  <div>
                    <span className="text-muted-foreground">
                      Available Sizes:
                    </span>
                    <p className="font-medium text-foreground">
                      {product.size}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stone Information */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Stone Information
              </h3>
              <div className="space-y-3 text-sm">
                {product.shape && (
                  <div>
                    <span className="text-muted-foreground">Shape:</span>
                    <p className="font-medium text-foreground">
                      {product.shape}
                    </p>
                  </div>
                )}
                {product.stoneValue !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Stone Value:</span>
                    <p className="font-bold text-primary">
                      ${product.stoneValue.toLocaleString()}
                    </p>
                  </div>
                )}
                {product.type && (
                  <div>
                    <span className="text-muted-foreground">Product Type:</span>
                    <p className="font-medium text-foreground capitalize">
                      {product.type}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Category Information */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Category Information
              </h3>
              <div className="space-y-3 text-sm">
                {product.category && (
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium text-foreground capitalize">
                      {product.category}
                    </p>
                  </div>
                )}
                {product.subcategory && (
                  <div>
                    <span className="text-muted-foreground">Subcategory:</span>
                    <p className="font-medium text-foreground capitalize">
                      {product.subcategory}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Additional Details
              </h3>
              <div className="space-y-3 text-sm">
                {product.productCode && (
                  <div>
                    <span className="text-muted-foreground">Product Code:</span>
                    <p className="font-mono font-medium text-foreground">
                      {product.productCode}
                    </p>
                  </div>
                )}
                {product.designNumber && (
                  <div>
                    <span className="text-muted-foreground">
                      Design Number:
                    </span>
                    <p className="font-mono font-medium text-foreground">
                      {product.designNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Value Summary */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Value Breakdown
              </h3>
              <div className="space-y-3 text-sm">
                {product.metalValue !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metal Value:</span>
                    <span className="font-medium text-foreground">
                      ${product.metalValue.toLocaleString()}
                    </span>
                  </div>
                )}
                {product.stoneValue !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stone Value:</span>
                    <span className="font-medium text-foreground">
                      ${product.stoneValue.toLocaleString()}
                    </span>
                  </div>
                )}
                {product.metalValue !== undefined &&
                  product.stoneValue !== undefined && (
                    <div className="border-t border-border pt-3 mt-3 flex justify-between">
                      <span className="font-semibold text-foreground">
                        Item Total:
                      </span>
                      <span className="font-bold text-primary">
                        $
                        {(
                          product.metalValue + product.stoneValue
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
