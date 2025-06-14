"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Ensure component is mounted before accessing localStorage

    const token = localStorage.getItem("accessToken");
    if (!token && pathname !== "/login") {
      router.replace("/login");
    }
    if (token && pathname === "/login") {
      router.replace("/");
    }
  }, [router, pathname, mounted]); // Add mounted to dependency array
  return <>{children}</>;
} 