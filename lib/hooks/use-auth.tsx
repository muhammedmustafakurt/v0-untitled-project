"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"

// Define types
interface User {
  id: string
  email: string
  name?: string
  balance: number
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
})

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    loadUserFromCookies()

    // Refresh user data every 30 seconds
    const interval = setInterval(() => {
      loadUserFromCookies()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadUserFromCookies = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        credentials: "include",
      })

      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (e) {
      console.error("Failed to load user", e)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    await loadUserFromCookies()
  }

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Giriş başarısız")
      }

      setUser(data.user)
      await loadUserFromCookies() // Immediately refresh user data after login

      // Admin kullanıcıları admin paneline yönlendir
      if (data.user.isAdmin) {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (e) {
      console.error("Login error", e)
      setError(e instanceof Error ? e.message : "Giriş başarısız")
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Kayıt başarısız")
      }

      // After registration, log the user in
      await login(email, password)
    } catch (e) {
      console.error("Registration error", e)
      setError(e instanceof Error ? e.message : "Kayıt başarısız")
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setLoading(true)
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      router.push("/login")
    } catch (e) {
      console.error("Logout error", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext)
}
