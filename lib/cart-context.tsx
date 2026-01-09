"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, Product, CustomProduct } from "./types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  addCustomToCart: (name: string, variant: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateCustomProduct: (
    productId: string,
    name: string,
    variant: string
  ) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

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

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const addCustomToCart = (name: string, variant: string, quantity: number) => {
    const customProduct: CustomProduct = {
      id: `custom-${Date.now()}`,
      name,
      variant,
      price: 0,
      isCustom: true,
      description: "",
      image: "",
      category: "",
      subcategory: "",
      type: "",
      inStock: false,
    };
    setItems((prevItems) => [
      ...prevItems,
      { product: customProduct, quantity },
    ]);
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
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addCustomToCart,
        removeFromCart,
        updateQuantity,
        updateCustomProduct,
        clearCart,
        getTotalPrice,
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
