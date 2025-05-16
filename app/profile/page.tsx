"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [balanceAmount, setBalanceAmount] = useState("10")
  const [isAddingBalance, setIsAddingBalance] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email)
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

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
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddBalance = async () => {
    if (!user) return

    try {
      setIsAddingBalance(true)
      const amount = Number.parseFloat(balanceAmount)

      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount")
      }

      // Bu kısım gerçek bir ödeme sistemi entegrasyonu ile değiştirilmelidir
      // Şimdilik sadece bakiyeyi artırıyoruz
      const response = await fetch("/api/user/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add balance")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: `Balance added successfully. New balance: ${data.balance.toFixed(2)} USD`,
      })

      // Sayfayı yenile
      window.location.reload()
    } catch (error) {
      console.error("Error adding balance:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add balance",
        variant: "destructive",
      })
    } finally {
      setIsAddingBalance(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
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
                  <div className="text-3xl font-bold">${user?.balance.toFixed(2)}</div>
                  <p className="text-sm text-gray-500">Mevcut bakiyeniz</p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Bakiye Yükle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bakiye Yükle</DialogTitle>
                      <DialogDescription>Hesabınıza bakiye yüklemek için bir miktar girin.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Miktar (USD)
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="1"
                          value={balanceAmount}
                          onChange={(e) => setBalanceAmount(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="text-sm text-gray-500">
                        Not: Bu demo sürümünde gerçek bir ödeme işlemi yapılmamaktadır.
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddBalance} disabled={isAddingBalance}>
                        {isAddingBalance ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            İşleniyor...
                          </>
                        ) : (
                          "Bakiye Yükle"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© 2025 Yemeksepeti Doğrulama. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
