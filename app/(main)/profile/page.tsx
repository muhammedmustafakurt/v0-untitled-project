"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  // Debug için log ekledik
  useEffect(() => {
    console.log("Profile page rendered, user:", user)
  }, [user])

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email)
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Hata",
        description: "Kullanıcı bilgileri yüklenemedi. Lütfen tekrar giriş yapın.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }

      toast({
        title: "Başarılı",
        description: "Profil başarıyla güncellendi",
      })

      // Kullanıcı bilgilerini yenile
      await refreshUser()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Profil güncellenemedi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
            <p className="text-center mt-4">Kullanıcı bilgileri yükleniyor...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bilgileri</CardTitle>
              <CardDescription>Kişisel bilgilerinizi güncelleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" value={email} disabled className="bg-gray-100" />
                  <p className="text-sm text-gray-500">E-posta adresi değiştirilemez</p>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Güncelleniyor...
                    </>
                  ) : (
                    "Profili Güncelle"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bakiye</CardTitle>
              <CardDescription>Mevcut bakiyeniz ve bakiye yükleme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="text-3xl font-bold">
                  {user.balance !== undefined ? user.balance.toFixed(2) : "0.00"} TL
                </div>
                <p className="text-sm text-gray-500">Mevcut bakiyeniz</p>
              </div>

              <Link href="https://t.me/sasi2701" target="_blank" rel="noopener noreferrer">
                <Button className="w-full flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Bakiye Yükle
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-2">Bakiye yüklemek için Telegram üzerinden iletişime geçin.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
