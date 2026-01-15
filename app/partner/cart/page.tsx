"use client";

import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { ShoppingCart, Trash2, Plus, Minus, Edit2, Loader } from "lucide-react";
import {
  AddCustomProduct,
  AddCustomProductModal,
} from "@/components/add-custom-product";
import { PARTNER_PRODUCTS_PAGE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CartPage() {
  const { user, isLoading } = useAuth();
  const { items, addToCart, removeFromCart, updateQuantity, getTotalPrice } =
    useCart();
  const router = useRouter();
  const [editProductId, seteEditProductId] = useState<string>("");
  const [isOrderPlacing, setIsOrderPlacing] = useState(false);

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

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const onPlaceOrder = async () => {
    try {
      setIsOrderPlacing(true);
    } catch (ex) {
      console.error("failed onPlaceOrder", ex);
    }
    setIsOrderPlacing(false);
  };
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
              href={PARTNER_PRODUCTS_PAGE}
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
                const isCustom = item.isCustomProduct;

                return (
                  <div
                    key={item.product.id}
                    className="bg-card border border-border rounded-lg p-4 flex gap-4"
                  >
                    {!isCustom && (
                      <Link
                        href={`${PARTNER_PRODUCTS_PAGE}/${item.product.id}`}
                        className="shrink-0"
                      >
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary">
                          <Image
                            src={
                              item.product.images?.[0]?.url ||
                              "/placeholder.svg"
                            }
                            alt={item.product.name as string}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                    )}
                    {isCustom && (
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                        <span className="text-xs text-muted-foreground text-center px-2">
                          No image
                        </span>
                      </div>
                    )}

                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="text-foreground font-semibold">
                          {item.product.name}
                        </div>
                        {/* {item.isCustomProduct && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Variant:
                          </p>
                        )} */}
                        {/* {!isCustom && (
                          <p className="text-sm text-muted-foreground mt-1">
                            ${0}
                          </p>
                        )} */}
                        {isCustom && (
                          <div className="flex flex-row gap-2">
                            <p className="text-sm text-muted-foreground mt-1">
                              Custom Product
                            </p>
                            <button
                              onClick={() => seteEditProductId(item.product.id)}
                              className="text-primary cursor-pointer hover:text-primary/80 transition text-sm flex items-center gap-1  mt-1"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-secondary rounded transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                            disabled={item.quantity === 1}
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
                          <p className="font-semibold text-muted-foreground"></p>

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
            <AddCustomProductModal
              editProductId={editProductId || ""}
              isOpen={editProductId?.length ? true : false}
              onClose={() => seteEditProductId("")}
            />
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

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={isOrderPlacing}
                      className="  w-full flex flex-row bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-medium text-center  disabled:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200"
                    >
                      {isOrderPlacing && (
                        <Loader className="w-5 h-5 animate-spin" />
                      )}
                      Place Order
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm</AlertDialogTitle>
                      <AlertDialogDescription>
                        Click confirm to place your order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onPlaceOrder}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Link
                  href={PARTNER_PRODUCTS_PAGE}
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
