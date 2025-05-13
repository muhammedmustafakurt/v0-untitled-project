"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquareIcon, RefreshCwIcon } from "lucide-react"
import { formatTimeLeft } from "@/lib/utils"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Session {
  id: string
  phoneNumber: string
  country: {
    name: string
    isoCode: string
  }
  expiresAt: string
  messageCount: number
}

interface ActiveNumbersListProps {
  sessions: Session[]
}

export function ActiveNumbersList({ sessions }: ActiveNumbersListProps) {
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      router.refresh()
      setRefreshing(false)
      toast({
        title: "Refreshed",
        description: "Your active numbers have been refreshed.",
      })
    }, 1000)
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
        <p className="text-amber-800">
          You don't have any rented numbers yet. Browse our available numbers to get started.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2">
          <RefreshCwIcon className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                  {session.country.isoCode}
                </div>
                <div>
                  <div className="font-medium">{session.phoneNumber}</div>
                  <div className="text-sm text-gray-500">{session.country.name}</div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="text-sm">
                  <span className="text-gray-500">Expires in: </span>
                  <span className="font-medium">{formatTimeLeft(session.expiresAt)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <MessageSquareIcon className="h-4 w-4 text-blue-500" />
                  <span>{session.messageCount} messages</span>
                </div>
              </div>

              <Link href={`/my-numbers/${session.id}`}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Messages</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
