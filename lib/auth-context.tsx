"use client";

import { getWhoAmIApi, userSignInApi } from "@/services/rajni-apis";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { AUTH_REFRESH_TOKEN_KEY, AUTH_TOKEN_KEY } from "./constants";
import { UserEntity } from "@/services/entities";
import { UserContextEntity } from "@/services/entities/user-context.entity";

interface AuthContextType {
  user: UserEntity | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  fetchUserByToken: (token: string) => Promise<UserContextEntity | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [userContext, setUserContext] = useState<UserContextEntity | null>();
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const accessToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (accessToken) {
      // In a real app, you'd decode the token and fetch user details
      // For now, we'll just set the user to null since we don't have a way to get the user details
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    // // Get existing users
    // const existingUsers = JSON.parse(
    //   localStorage.getItem("jewelry_users") || "[]"
    // );
    // if (existingUsers.find((u: any) => u.email === email)) {
    //   throw new Error("Email already registered");
    // }
    // const newUser = {
    //   id: Date.now().toString(),
    //   email,
    //   password: password, // In production, this should be hashed
    //   name,
    // };
    // existingUsers.push(newUser);
    // localStorage.setItem("jewelry_users", JSON.stringify(existingUsers));
    // const currentUser = { id: newUser.id, email, name };
    // setUser(currentUser);
    // localStorage.setItem("jewelry_user", JSON.stringify(currentUser));
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await userSignInApi({
        email,
        password,
      });
      localStorage.setItem(AUTH_TOKEN_KEY, result.accessToken);
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, result.refreshToken);
      setUser(result.user);
    } catch (err) {
      console.error("SignIn error:", err);
      throw err;
    }
  };

  const signOut = () => {
    setUser(null);
    setUserContext(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  };

  const fetchUserByToken = async (token: string) => {
    try {
      const userContext = await getWhoAmIApi();
      setUser(userContext.user);
      setUserContext(userContext);
      return userContext;
    } catch (error) {
      console.error("Error fetching user context:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signUp, signIn, signOut, fetchUserByToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
