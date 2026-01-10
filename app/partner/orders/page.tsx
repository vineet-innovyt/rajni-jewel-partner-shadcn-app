"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { ChevronDown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, isLoading, router]);

  // Load orders from localStorage
  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(
        localStorage.getItem("jewelry_orders") || "[]"
      );
      const userOrders = allOrders.filter(
        (order: any) => order.userId === user.id
      );
      setOrders(
        userOrders.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    }
  }, [user]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓";
      case "processing":
        return "◄";
      case "shipped":
        return "→";
      default:
        return "?";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          <span className="text-balance">My Orders</span>
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-6">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No orders yet</p>
            </div>
            <Link
              href="/products"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() =>
                    setExpandedOrderId(
                      expandedOrderId === order.id ? null : order.id
                    )
                  }
                  className="w-full bg-card p-4 md:p-6 hover:bg-secondary/50 transition flex justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-grow text-left">
                    <div className="flex gap-4 items-start md:items-center flex-col md:flex-row">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Order #ORD-{order.id}
                        </p>
                        <h3 className="text-lg font-semibold text-foreground mt-1">
                          {formatDate(order.date)}
                        </h3>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)} {order.status}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {order.items.length} item(s)
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-2xl font-bold text-primary">
                      $
                      {order.totalPrice.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <ChevronDown
                      size={20}
                      className={`text-muted-foreground transition ${
                        expandedOrderId === order.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Order Details */}
                {expandedOrderId === order.id && (
                  <div className="border-t border-border bg-secondary/30 p-4 md:p-6 space-y-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="flex gap-4">
                            <div className="relative w-20 h-20 rounded bg-card border border-border flex-shrink-0">
                              <Image
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-grow">
                              <h5 className="font-medium text-foreground">
                                {item.product.name}
                              </h5>
                              <p className="text-sm text-muted-foreground mt-1">
                                ${item.product.price.toLocaleString()} x{" "}
                                {item.quantity}
                              </p>
                              <p className="text-sm font-semibold text-primary mt-1">
                                $
                                {(
                                  item.product.price * item.quantity
                                ).toLocaleString("en-US", {
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    {(order as any).shippingInfo && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">
                          Shipping Address
                        </h4>
                        <div className="bg-card border border-border rounded p-4 text-sm text-muted-foreground">
                          <p>
                            {(order as any).shippingInfo.firstName}{" "}
                            {(order as any).shippingInfo.lastName}
                          </p>
                          <p>{(order as any).shippingInfo.street}</p>
                          <p>
                            {(order as any).shippingInfo.city},{" "}
                            {(order as any).shippingInfo.state}{" "}
                            {(order as any).shippingInfo.postalCode}
                          </p>
                          <p>{(order as any).shippingInfo.country}</p>
                          <p className="text-foreground mt-3">
                            {(order as any).shippingInfo.email}
                          </p>
                          <p className="text-foreground">
                            {(order as any).shippingInfo.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Order Total */}
                    <div className="bg-card border border-border rounded p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">
                          $
                          {(order.totalPrice * 0.926).toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-foreground">Free</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-border pt-2">
                        <span className="font-semibold text-foreground">
                          Total
                        </span>
                        <span className="text-lg font-bold text-primary">
                          $
                          {order.totalPrice.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        href="/products"
                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition font-medium text-center text-sm"
                      >
                        Continue Shopping
                      </Link>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        size="sm"
                      >
                        Download Invoice
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
