"use client";

import type React from "react";

import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const [newOrder, setNewOrder] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push("/cart");
    }
  }, [items, router, orderPlaced]);

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
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateShippingInfo = () => {
    return (
      shippingInfo.firstName &&
      shippingInfo.lastName &&
      shippingInfo.email &&
      shippingInfo.phone &&
      shippingInfo.street &&
      shippingInfo.city &&
      shippingInfo.state &&
      shippingInfo.postalCode
    );
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("jewelry_orders") || "[]");
    const newOrderData = {
      id: Date.now().toString(),
      userId: user.id,
      items,
      totalPrice: total,
      date: new Date().toISOString(),
      status: "completed" as const,
      shippingInfo,
    };

    orders.push(newOrderData);
    localStorage.setItem("jewelry_orders", JSON.stringify(orders));

    // Clear cart
    clearCart();
    setOrderPlaced(true);
    setNewOrder(newOrderData);
    setIsProcessing(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-green-50 border-2 border-green-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-600" size={40} />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              Order Confirmed
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase! Your order has been placed
              successfully.
            </p>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-lg font-bold text-foreground">
                  #ORD-{orderPlaced && newOrder?.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-primary">
                  ${total.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Estimated Delivery
                </p>
                <p className="text-foreground font-medium">5-7 Business Days</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/orders"
                className="block w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-medium"
              >
                View Orders
              </Link>
              <Link
                href={PARTNER_PRODUCTS_PAGE}
                className="block w-full border border-border text-foreground py-3 rounded-lg hover:bg-secondary transition font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          <span className="text-balance">Checkout</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="flex gap-4 mb-8">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  step === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                1
              </div>
              <div className="flex-grow flex items-center">
                <div
                  className={`h-1 w-full ${
                    step === 2 ? "bg-primary" : "bg-border"
                  }`}
                ></div>
              </div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  step === 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                2
              </div>
            </div>

            {/* Step 1: Shipping Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      First Name
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Street Address
                  </label>
                  <Input
                    type="text"
                    name="street"
                    value={shippingInfo.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      City
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      State/Province
                    </label>
                    <Input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!validateShippingInfo()}
                  className="w-full"
                  size="lg"
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Step 2: Review & Payment */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Review & Payment
                </h2>

                {/* Shipping Summary */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">
                    Shipping To
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                    <br />
                    {shippingInfo.street}
                    <br />
                    {shippingInfo.city}, {shippingInfo.state}{" "}
                    {shippingInfo.postalCode}
                    <br />
                    {shippingInfo.country}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="mt-4 w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                </div>

                {/* Payment Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    Payment Method
                  </h3>
                  <div className="border-2 border-primary rounded-lg p-4 bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <span className="text-sm text-foreground">
                        •••• •••• •••• 4242
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is a demo. In production, use Stripe or similar payment
                    gateway.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full"
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24 space-y-4">
              <h3 className="text-lg font-bold text-foreground">
                Order Summary
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto border-b border-border pb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded bg-secondary flex-shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow text-sm">
                      <p className="text-foreground font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-primary font-semibold">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "Free" : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">
                    ${tax.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${total.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
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
