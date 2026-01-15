"use client";
import { Header } from "@/components/header";
import { useCart } from "@/lib/cart-context";
import { PARTNER_ORDERS_PAGE, PARTNER_PRODUCTS_PAGE } from "@/lib/constants";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { currentOrder, setCurrentOrder } = useCart();

  useEffect(() => {
    if (!currentOrder) {
      router.push(PARTNER_PRODUCTS_PAGE);
    }
    return () => {
      setCurrentOrder(null);
    };
  }, []);

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
                {currentOrder?.orderNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-primary">N/A</p>
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
              href={PARTNER_ORDERS_PAGE}
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
