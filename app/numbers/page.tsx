import { getCountries } from "@/lib/api"
import { CountryList } from "@/components/country-list"
import { mockCountries } from "@/components/mock-data"

// Sayfayı dinamik olarak işaretle
export const dynamic = "force-dynamic"

export default async function NumbersPage() {
  let countries = []
  let error = null

  try {
    // Try to get real data from API
    countries = await getCountries()

    // If no countries returned but no error, use mock data
    if (countries.length === 0) {
      console.log("No countries returned from API, using mock data")
      countries = mockCountries
    }
  } catch (err) {
    console.error("Error in NumbersPage:", err)
    error = err instanceof Error ? err.message : "Unknown error occurred"

    // Use mock data if API fails
    console.log("API error, using mock data")
    countries = mockCountries
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rent a Phone Number</h1>
      <p className="text-gray-600 mb-8">Select a country to view available phone numbers for rent.</p>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Note: Using demo data</p>
          <p className="text-sm">
            We're currently showing demo data because we couldn't connect to the API. This is normal if you're just
            testing the interface.
          </p>
        </div>
      )}

      <CountryList countries={countries} />
    </div>
  )
}
