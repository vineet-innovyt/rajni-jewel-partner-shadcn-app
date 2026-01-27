"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { ChevronDown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PARTNER_PRODUCTS_PAGE, QUERY_KEYS } from "@/lib/constants";
import { getPartnerOrderSearchApi } from "@/services/rajni-apis";
import { useQuery } from "@tanstack/react-query";
import { OrderEntity } from "@/services/entities";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { format } from "date-fns";
import Footer from "@/components/footer";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@/lib/helpers/get-status-color";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return "✓";
    case "placed":
      return "◄";
    case "shipped":
      return "→";
    default:
      return "";
  }
};
const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "placed":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const {
    data: searchResult,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.Orders],
    queryFn: () => getPartnerOrderSearchApi(0, 500),
  });

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

  const orders = searchResult?.items || [];

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
              href={PARTNER_PRODUCTS_PAGE}
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderBlock key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

const OrderBlock = ({ order }: { order: OrderEntity }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  // const { toPDF, targetRef } = usePDF({
  //   filename: `${order.orderNumber}.pdf`,
  // });
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const onDownload = () => {
    reactToPrintFn();
  };

  return (
    <div
      ref={contentRef}
      key={order.id}
      className="border border-border rounded-lg overflow-hidden"
    >
      {/* Order Header */}
      <button
        onClick={() =>
          setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
        }
        className="w-full bg-card p-4 md:p-6 hover:bg-secondary/50 transition flex justify-between items-start md:items-center gap-4"
      >
        <div className="flex-grow text-left">
          <div className="flex gap-4 items-start md:items-center flex-col md:flex-row">
            <div>
              <p className="text-sm text-muted-foreground">
                Order #{order.orderNumber}
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-1">
                {format(order.createdOn, "MM-dd-yyyy hh-mm a")}
              </h3>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getOrderStatusColor(
                order.currentStage.type,
              )}`}
            >
              {getOrderStatusLabel(order.currentStage.type)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {order.items.length} item(s)
          </p>
        </div>

        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-2xl font-bold text-primary">
            {order.items?.length} (Products)
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
            <h4 className="font-semibold text-foreground mb-4">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative w-20 h-20 rounded bg-card border border-border flex-shrink-0">
                    <Image
                      src={item.product.images?.[0]?.url || "/placeholder.svg"}
                      alt={item.product.name as string}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-medium text-foreground">
                      {item.product.name}
                    </h5>
                    {item.isCustomProduct && item.product?.type && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.product?.type.code}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Qty:{" "}
                      {!item.isCustomProduct
                        ? item.quantity
                        : item.quantity + " " + item.unitType}
                    </p>
                    {item.isCustomProduct && (
                      <p className="text-sm font-semibold text-primary mt-1">
                        (Custom Product)
                      </p>
                    )}
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
              <span className="text-foreground">N/A</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">Free</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-2">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">N/A</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href={PARTNER_PRODUCTS_PAGE}
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition font-medium text-center text-sm"
            >
              Continue Shopping
            </Link>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              size="sm"
              onClick={onDownload}
            >
              Print Proforma
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
