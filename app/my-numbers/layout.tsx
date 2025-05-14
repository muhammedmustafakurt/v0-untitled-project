import type React from "react"
import { Header } from "@/components/header"

export default function MyNumbersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© 2025 Yemeksepeti Doğrulama. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
