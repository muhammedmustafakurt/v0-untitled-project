import { getPhoneNumbers } from "@/lib/api"
import { PhoneNumberList } from "@/components/phone-number-list"
import { mockPhoneNumbers } from "@/components/mock-data"

export default async function CountryNumbersPage({ params }: { params: { countryId: string } }) {
  let phoneNumbers = []
  let error = null

  try {
    // Try to get real data from API
    phoneNumbers = await getPhoneNumbers(params.countryId)

    // If no phone numbers returned but no error, use mock data
    if (phoneNumbers.length === 0) {
      console.log("No phone numbers returned from API, using mock data")
      phoneNumbers = mockPhoneNumbers
    }
  } catch (err) {
    console.error("Error in CountryNumbersPage:", err)
    error = err instanceof Error ? err.message : "Unknown error occurred"

    // Use mock data if API fails
    console.log("API error, using mock data")
    phoneNumbers = mockPhoneNumbers
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Numbers</h1>
      <p className="text-gray-600 mb-8">Choose a phone number to rent from the list below.</p>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Note: Using demo data</p>
          <p className="text-sm">
            We're currently showing demo phone numbers because we couldn't connect to the API. This is normal if you're
            just testing the interface.
          </p>
        </div>
      )}

      <PhoneNumberList phoneNumbers={phoneNumbers} countryId={params.countryId} />
    </div>
  )
}
