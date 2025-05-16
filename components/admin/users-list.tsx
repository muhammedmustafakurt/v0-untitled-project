"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, User, Shield, CreditCard } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface UserType {
  _id: string
  email: string
  name?: string
  balance: number
  isAdmin: boolean
  createdAt: string
  sessions?: string[]
}

export function AdminUsersList() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [balanceAmount, setBalanceAmount] = useState("0")
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users")

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBalance = async () => {
    if (!selectedUser) return

    try {
      setIsUpdating(true)
      const amount = Number.parseFloat(balanceAmount)

      if (isNaN(amount)) {
        throw new Error("Please enter a valid amount")
      }

      const response = await fetch(`/api/admin/users/${selectedUser._id}/balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update balance")
      }

      const data = await response.json()

      // Update the user in the list
      setUsers(users.map((user) => (user._id === selectedUser._id ? { ...user, balance: data.balance } : user)))

      toast({
        title: "Success",
        description: `Balance updated successfully. New balance: ${data.balance.toFixed(2)} USD`,
      })

      setBalanceAmount("0")
      setSelectedUser(null)
    } catch (error) {
      console.error("Error updating balance:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update balance",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const makeAdmin = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/make-admin`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to make user admin")
      }

      // Update the user in the list
      setUsers(users.map((user) => (user._id === userId ? { ...user, isAdmin: true } : user)))

      toast({
        title: "Success",
        description: "User is now an admin",
      })
    } catch (error) {
      console.error("Error making user admin:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to make user admin",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Kullanıcı Yönetimi</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Kullanıcı ara..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Bakiye</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Kayıt Tarihi</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Kullanıcı bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-gray-400" />
                          <span>{user.name || "İsimsiz Kullanıcı"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>${user.balance.toFixed(2)}</TableCell>
                      <TableCell>
                        {user.isAdmin ? (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Shield className="h-4 w-4" />
                            <span>Admin</span>
                          </div>
                        ) : (
                          "Kullanıcı"
                        )}
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                <CreditCard className="h-4 w-4 mr-1" />
                                Bakiye
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Bakiye Güncelle</DialogTitle>
                                <DialogDescription>
                                  {selectedUser?.email} kullanıcısının bakiyesini güncelleyin. Mevcut bakiye: $
                                  {selectedUser?.balance.toFixed(2)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="amount" className="text-right">
                                    Miktar
                                  </Label>
                                  <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={balanceAmount}
                                    onChange={(e) => setBalanceAmount(e.target.value)}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="text-sm text-gray-500">
                                  Not: Pozitif değer bakiyeyi artırır, negatif değer azaltır.
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleUpdateBalance} disabled={isUpdating}>
                                  {isUpdating ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Güncelleniyor...
                                    </>
                                  ) : (
                                    "Bakiyeyi Güncelle"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {!user.isAdmin && (
                            <Button variant="outline" size="sm" onClick={() => makeAdmin(user._id)}>
                              <Shield className="h-4 w-4 mr-1" />
                              Admin Yap
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
