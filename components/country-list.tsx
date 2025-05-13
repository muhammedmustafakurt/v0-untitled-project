"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

interface Country {
  id: number
  name: string
  isoCode: string
}

interface CountryListProps {
  countries: Country[]
}

export function CountryList({ countries }: CountryListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCountries = countries.filter((country) => country.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search countries..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCountries.map((country) => (
          <Link href={`/numbers/${country.id}`} key={country.id}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {country.isoCode}
                </div>
                <span className="font-medium">{country.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-8 text-gray-500">No countries found matching your search.</div>
      )}
    </div>
  )
}
