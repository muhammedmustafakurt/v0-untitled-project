import type React from "react"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                  <p className="text-sm text-gray-400">© 2025 Yemeksepeti Doğrulama. Tüm hakları saklıdır.</p>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
