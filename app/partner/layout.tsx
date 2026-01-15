import type React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { AppInitComp } from "@/lib/app-init";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <AppInitComp>
            <CartProvider>{children}</CartProvider>
          </AppInitComp>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
