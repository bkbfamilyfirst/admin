import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientProviders from "@/components/ClientProviders"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Family First Admin Panel",
  description: "Admin control center for parental control ecosystem management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
