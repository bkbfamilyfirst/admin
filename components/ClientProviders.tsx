'use client'

import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import BottomNav from "@/components/bottom-nav"
import { AuthGuard } from "@/components/AuthGuard"
import { usePathname } from "next/navigation"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-20 sm:pb-24 md:pb-28">
          <AuthGuard>{children}</AuthGuard>
        </main>
        {!isLoginPage && <BottomNav />}
      </div>
      <Toaster />
    </ThemeProvider>
  )
} 