"use client"

import Link from "next/link"
import { ShoppingBagIcon, UserIcon, LogOutIcon, MenuIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b bg-red-600 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="h-6 w-6 text-white" />
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
              {user ? (
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white hover:text-red-100 hover:bg-red-700">
                        <UserIcon className="h-5 w-5 mr-2" />
                        {user.name || user.email}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/my-numbers">Numaralarım</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                        <LogOutIcon className="h-4 w-4 mr-2" />
                        Çıkış Yap
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ) : (
                <li>
                  <Link href="/login">
                    <Button variant="outline" className="bg-white text-red-600 hover:bg-red-50">
                      Giriş Yap
                    </Button>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
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
              {user ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      className="block py-2 font-medium text-white hover:text-red-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profil
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center py-2 font-medium text-white hover:text-red-100"
                    >
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Çıkış Yap
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="block py-2 font-medium text-white hover:text-red-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
