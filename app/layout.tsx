import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { InventoryProvider } from "@/lib/inventory-context"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Home Inventory System (Next.js 14)",
  description: "Track and manage your home inventory for insurance purposes",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InventoryProvider>
          {children}
          <Toaster />
        </InventoryProvider>
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"



import './globals.css'