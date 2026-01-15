"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "./types";
import { OrderEntity } from "@/services/entities/order.entity";

interface CartContextType {
  items: CartItem[];
  addToCart: (e: CartItem) => void;

  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  // updateCustomProduct: (e: CartItem) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  setCurrentOrder: (e: OrderEntity | null) => void;
  currentOrder: OrderEntity | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentOrder, setCurrentOrderState] = useState<OrderEntity | null>(
    null
  );

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("jewelry_cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("jewelry_cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (e: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === e.product.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === e.product.id ? { ...e } : item
        );
      }
      return [
        ...prevItems,
        {
          ...e,
          lineItemId: Date.now().toString(),
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateCustomProduct = (
    productId: string,
    name: string,
    variant: string
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (
          item.product.id === productId &&
          "isCustom" in item.product &&
          item.product.isCustom
        ) {
          return {
            ...item,
            product: {
              ...item.product,
              name,
              variant,
            },
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + 0 * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        //  updateCustomProduct,
        clearCart,
        getTotalPrice,
        setCurrentOrder: (e) => setCurrentOrderState(e),
        currentOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
