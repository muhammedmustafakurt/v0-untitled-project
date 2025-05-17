"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b bg-red-600 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-white" />
            <Link href="/" className="text-xl font-bold">
              Yemeksepeti Doğrulama
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-6 items-center">
              <li>
                <Link href="/" className="font-medium text-white hover:text-red-100">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/my-numbers" className="font-medium text-white hover:text-red-100">
                  Numaralarım
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  href="/"
                  className="block py-2 font-medium text-white hover:text-red-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  href="/my-numbers"
                  className="block py-2 font-medium text-white hover:text-red-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Numaralarım
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
