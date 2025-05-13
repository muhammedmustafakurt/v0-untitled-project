import { getSessionMessages } from "@/lib/api"
import { MessageList } from "@/components/message-list"
import { mockMessages } from "@/components/mock-data"

export default async function SessionMessagesPage({ params }: { params: { sessionId: string } }) {
  let messages = []
  let error = null

  try {
    // Try to get real data from API
    messages = await getSessionMessages(params.sessionId)

    // If no messages returned but no error, use mock data for demo
    if (messages.length === 0) {
      console.log("No messages returned from API, using mock data")
      messages = mockMessages
    }
  } catch (err) {
    console.error("Error in SessionMessagesPage:", err)
    error = err instanceof Error ? err.message : "Unknown error occurred"

    // Use mock data if API fails
    console.log("API error, using mock data")
    messages = mockMessages
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <p className="text-gray-600 mb-8">View all messages received on this number.</p>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Note: Using demo data</p>
          <p className="text-sm">
            We're currently showing demo messages because we couldn't connect to the API. This is normal if you're just
            testing the interface.
          </p>
        </div>
      )}

      <MessageList messages={messages} />
    </div>
  )
}
