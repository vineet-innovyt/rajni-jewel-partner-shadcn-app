"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QueryProvider } from "@/services/query-provider";
import { useAuth } from "./auth-context";
import {
  AUTH_TOKEN_KEY,
  PARTNER_SIGN_IN_PAGE,
  PARTNER_SIGN_UP_PAGE,
} from "./constants";
interface IAppInitCompProps {
  //  tenantCode: string;
  children?: ReactNode;
}

export const AppInitComp: React.FC<IAppInitCompProps> = ({ children }) => {
  const { user, fetchUserByToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentPathname = usePathname();

  useEffect(() => {
    console.log("AppInitComp env", process.env.NEXT_PUBLIC_VER);
  }, []);

  useEffect(() => {
    const unAuthPaths = [PARTNER_SIGN_IN_PAGE, PARTNER_SIGN_UP_PAGE];

    (async () => {
      setIsLoading(true);
      if (!user && !unAuthPaths.includes(currentPathname)) {
        const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!authToken) {
          router.push(PARTNER_SIGN_IN_PAGE);
        } else {
          try {
            await fetchUserByToken(authToken);
          } catch (error) {
            console.error("Error fetching user context:", error);
            router.push(PARTNER_SIGN_IN_PAGE);
          }
        }
      }
      setIsLoading(false);
    })();
  }, [user, router]);

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
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary"></div>
      <h1 className="ml-2 animate-pulse">Loading...</h1>
    </div>
  );
}
