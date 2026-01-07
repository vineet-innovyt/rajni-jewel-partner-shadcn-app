"use client"

import Link from "next/link"
import { ShoppingCart, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Header() {
  const { user, signOut } = useAuth()
  const { items } = useCart()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSignOut = () => {
    signOut()
    router.push("/auth/sign-in")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Jewel
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/products" className="text-foreground hover:text-primary transition text-sm font-medium">
              Shop All
            </Link>
            <Link
              href="/cart"
              className="text-foreground hover:text-primary transition text-sm font-medium flex items-center gap-2 relative"
            >
              <ShoppingCart size={18} />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link href="/orders" className="text-foreground hover:text-primary transition text-sm font-medium">
              Orders
            </Link>
            <div className="flex items-center gap-4 pl-6 border-l border-border">
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link
              href="/products"
              className="block text-foreground hover:text-primary transition text-sm font-medium py-2"
            >
              Shop All
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-foreground hover:text-primary transition text-sm font-medium py-2 relative"
            >
              <ShoppingCart size={18} />
              Cart
              {cartItemCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              href="/orders"
              className="block text-foreground hover:text-primary transition text-sm font-medium py-2"
            >
              Orders
            </Link>
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground flex-1">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
