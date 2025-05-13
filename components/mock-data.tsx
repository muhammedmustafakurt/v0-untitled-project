// This file provides mock data for development and testing

export const mockCountries = [
  { id: 1, name: "United States", isoCode: "US" },
  { id: 2, name: "United Kingdom", isoCode: "GB" },
  { id: 3, name: "Canada", isoCode: "CA" },
  { id: 4, name: "Australia", isoCode: "AU" },
  { id: 5, name: "Germany", isoCode: "DE" },
  { id: 6, name: "France", isoCode: "FR" },
  { id: 7, name: "Spain", isoCode: "ES" },
  { id: 8, name: "Italy", isoCode: "IT" },
  { id: 9, name: "Netherlands", isoCode: "NL" },
  { id: 10, name: "Turkey", isoCode: "TR" },
]

export const mockPhoneNumbers = [
  { id: "101", number: "+1 (555) 123-4567", price: 2.99, currency: "USD" },
  { id: "102", number: "+1 (555) 234-5678", price: 3.49, currency: "USD" },
  { id: "103", number: "+1 (555) 345-6789", price: 2.49, currency: "USD" },
  { id: "104", number: "+1 (555) 456-7890", price: 3.99, currency: "USD" },
  { id: "105", number: "+1 (555) 567-8901", price: 2.79, currency: "USD" },
  { id: "106", number: "+1 (555) 678-9012", price: 3.29, currency: "USD" },
]

export const mockMessages = [
  {
    id: "m1",
    sender: "Service",
    content: "Your verification code is 123456",
    receivedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: "m2",
    sender: "Bank",
    content: "Your account has been verified successfully.",
    receivedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
  {
    id: "m3",
    sender: "App",
    content: "Welcome to our service! Your registration is complete.",
    receivedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
]

export const mockSessions = [
  {
    id: "s1",
    phoneNumber: "+1 (555) 123-4567",
    country: {
      name: "United States",
      isoCode: "US",
    },
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
    messageCount: 3,
  },
  {
    id: "s2",
    phoneNumber: "+44 7700 900123",
    country: {
      name: "United Kingdom",
      isoCode: "GB",
    },
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString(), // 1 hour from now
    messageCount: 1,
  },
]
