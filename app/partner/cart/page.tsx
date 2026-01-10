"use client";

import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { ShoppingCart, Trash2, Plus, Minus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddCustomProduct } from "@/components/add-custom-product";

export default function CartPage() {
  const { user, isLoading } = useAuth();
  const {
    items,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    updateCustomProduct,
  } = useCart();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editVariant, setEditVariant] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, isLoading, router]);

  const handleSaveEdit = (productId: string) => {
    if (editName.trim() && editVariant.trim()) {
      updateCustomProduct(productId, editName.trim(), editVariant.trim());
      setEditingId(null);
    }
  };

  const handleEditCustom = (
    productId: string,
    name: string,
    variant: string
  ) => {
    setEditingId(productId);
    setEditName(name);
    setEditVariant(variant);
  };

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

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          <span className="text-balance">Shopping Cart</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-6">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Your cart is empty</p>
            </div>
            <Link
              href="/products"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AddCustomProduct />

              {items.map((item) => {
                const isCustom =
                  "isCustom" in item.product && item.product.isCustom;
                const isEditing = editingId === item.product.id;

                return (
                  <div
                    key={item.product.id}
                    className="bg-card border border-border rounded-lg p-4 flex gap-4"
                  >
                    {!isCustom && (
                      <Link
                        href={`/products/${item.product.id}`}
                        className="flex-shrink-0"
                      >
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                    )}
                    {isCustom && (
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                        <span className="text-xs text-muted-foreground text-center px-2">
                          Custom Item
                        </span>
                      </div>
                    )}

                    <div className="flex-grow flex flex-col justify-between">
                      {isEditing ? (
                        <div className="space-y-2 mb-2">
                          <Input
                            placeholder="Product Name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Variant"
                            value={editVariant}
                            onChange={(e) => setEditVariant(e.target.value)}
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                              onClick={() => handleSaveEdit(item.product.id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-foreground font-semibold">
                            {item.product.name}
                          </div>
                          {isCustom && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Variant: {item.product.variant}
                            </p>
                          )}
                          {!isCustom && (
                            <p className="text-sm text-muted-foreground mt-1">
                              ${item.product.price.toLocaleString()}
                            </p>
                          )}
                          {isCustom && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Price: Custom Quote
                            </p>
                          )}
                          {isCustom && (
                            <button
                              onClick={() =>
                                handleEditCustom(
                                  item.product.id,
                                  item.product.name,
                                  item.product.variant
                                )
                              }
                              className="text-primary hover:text-primary/80 transition text-sm mt-2 flex items-center gap-1"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-secondary rounded transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-secondary rounded transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          {!isCustom && (
                            <p className="font-semibold text-primary">
                              $
                              {(
                                item.product.price * item.quantity
                              ).toLocaleString()}
                            </p>
                          )}
                          {isCustom && (
                            <p className="font-semibold text-muted-foreground">
                              —
                            </p>
                          )}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-destructive hover:text-destructive/80 transition text-sm mt-1 flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24 space-y-4">
                <h2 className="text-lg font-bold text-foreground">
                  Order Summary
                </h2>

                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="text-foreground">
                      $
                      {tax.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    $
                    {total.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-medium text-center"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="block w-full border border-border text-foreground py-3 rounded-lg hover:bg-secondary transition font-medium text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Rajni Jewel. All rights reserved.
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
