"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("jewelry_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    // Get existing users
    const existingUsers = JSON.parse(localStorage.getItem("jewelry_users") || "[]")

    if (existingUsers.find((u: any) => u.email === email)) {
      throw new Error("Email already registered")
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password: password, // In production, this should be hashed
      name,
    }

    existingUsers.push(newUser)
    localStorage.setItem("jewelry_users", JSON.stringify(existingUsers))

    const currentUser = { id: newUser.id, email, name }
    setUser(currentUser)
    localStorage.setItem("jewelry_user", JSON.stringify(currentUser))
  }

  const signIn = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("jewelry_users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (!foundUser) {
      throw new Error("Invalid email or password")
    }

    const currentUser = { id: foundUser.id, email: foundUser.email, name: foundUser.name }
    setUser(currentUser)
    localStorage.setItem("jewelry_user", JSON.stringify(currentUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("jewelry_user")
  }

  return <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
