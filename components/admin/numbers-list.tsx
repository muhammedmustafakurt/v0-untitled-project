"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, Phone, User, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatTimeLeft } from "@/lib/utils"

interface Session {
  id: string
  phoneNumber: string
  userId: string
  userEmail: string
  userName?: string
  country: {
    name: string
    isoCode: string
  }
  platform: {
    name: string
  }
  expiresAt: string
  messageCount: number
  status?: string
}

export function AdminNumbersList() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchSessions()

    // Refresh every 30 seconds
    const interval = setInterval(fetchSessions, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/sessions")

      if (!response.ok) {
        throw new Error("Failed to fetch sessions")
      }

      const data = await response.json()
      setSessions(data.sessions)
    } catch (error) {
      console.error("Error fetching sessions:", error)
      toast({
        title: "Error",
        description: "Failed to load sessions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = sessions.filter(
    (session) =>
      session.phoneNumber.includes(searchTerm) ||
      session.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.userName && session.userName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Kiralanan Numaralar</h2>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Numara veya kullanıcı ara..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={fetchSessions} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yenile"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading && sessions.length === 0 ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Telefon Numarası</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Ülke</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Kalan Süre</TableHead>
                  <TableHead>Mesaj Sayısı</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Kiralanan numara bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSessions.map((session) => {
                    const isExpired = new Date(session.expiresAt) < new Date()

                    return (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <span>{session.phoneNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                              <div>{session.userName || "İsimsiz Kullanıcı"}</div>
                              <div className="text-xs text-gray-500">{session.userEmail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{session.country.name}</TableCell>
                        <TableCell>{session.platform.name}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              isExpired
                                ? "bg-red-100 text-red-800"
                                : session.status === "finished"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {isExpired ? "Süresi Doldu" : session.status === "finished" ? "Tamamlandı" : "Aktif"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{isExpired ? "Süresi Doldu" : formatTimeLeft(session.expiresAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{session.messageCount}</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
