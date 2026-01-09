"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QueryProvider } from "@/services/query-provider";
import { useAuth } from "./auth-context";
interface IAppInitCompProps {
  //  tenantCode: string;
  children?: ReactNode;
}

export const AppInitComp: React.FC<IAppInitCompProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("AppInitComp env", process.env.NEXT_PUBLIC_VER);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <Loading />;

  return <QueryProvider>{children}</QueryProvider>;
};

// You can use a lightweight component here, even a simple message or a custom spinner
export function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1>Loading...</h1>
    </div>
  );
}
