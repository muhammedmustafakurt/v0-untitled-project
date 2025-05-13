"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, PhoneIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PhoneNumber {
  id: string
  number: string
  price: number
  currency: string
}

interface PhoneNumberListProps {
  phoneNumbers: PhoneNumber[]
  countryId: string
}

export function PhoneNumberList({ phoneNumbers, countryId }: PhoneNumberListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const filteredNumbers = phoneNumbers.filter((phone) => phone.number.includes(searchTerm))

  const handleRent = async (phoneId: string) => {
    setLoading(phoneId)
    try {
      // For demo purposes, simulate a successful API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get the phone number details
      const phoneNumber = phoneNumbers.find((p) => p.id === phoneId)

      // Create a mock session
      const mockSession = {
        id: `session-${Date.now()}`,
        phoneNumber: phoneNumber?.number || "+1 (555) 123-4567",
        country: {
          name: "Demo Country",
          isoCode: "DC",
        },
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
        messageCount: 0,
      }

      // Store in localStorage
      const existingSessions = JSON.parse(localStorage.getItem("sessions") || "[]")
      localStorage.setItem("sessions", JSON.stringify([...existingSessions, mockSession.id]))

      // Also set in cookies for server-side access
      document.cookie = `sessions=${JSON.stringify([...existingSessions, mockSession.id])}; path=/; max-age=86400`

      toast({
        title: "Number rented successfully!",
        description: "You can now receive SMS messages on this number.",
        variant: "default",
      })

      router.push("/my-numbers")
    } catch (error) {
      console.error("Error renting number:", error)
      toast({
        title: "Failed to rent number",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search phone numbers..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNumbers.map((phone) => (
          <Card key={phone.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <PhoneIcon className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-lg">{phone.number}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-emerald-700 font-semibold">
                  {phone.price} {phone.currency}
                </div>
                <Button
                  onClick={() => handleRent(phone.id)}
                  disabled={loading === phone.id}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading === phone.id ? "Renting..." : "Rent Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNumbers.length === 0 && (
        <div className="text-center py-8 text-gray-500">No phone numbers found matching your search.</div>
      )}
    </div>
  )
}
