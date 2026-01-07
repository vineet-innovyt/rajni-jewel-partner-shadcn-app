"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const handleSignOut = () => {
    signOut()
    router.push("/auth/sign-in")
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Jewel
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/products" className="text-foreground hover:text-primary transition">
              Shop
            </Link>
            <Link href="/cart" className="text-foreground hover:text-primary transition">
              Cart
            </Link>
            <Link href="/orders" className="text-foreground hover:text-primary transition">
              Orders
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-md">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <label className="text-sm text-muted-foreground">Full Name</label>
            <p className="text-xl font-semibold text-foreground">{user.name}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="text-xl font-semibold text-foreground">{user.email}</p>
          </div>

          <Button onClick={handleSignOut} variant="destructive" className="w-full">
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  )
}
