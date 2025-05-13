import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to a readable format
export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date)
}

// Calculate and format time left until expiration
export function formatTimeLeft(expiresAt: string) {
  const now = new Date()
  const expiration = new Date(expiresAt)
  const diffMs = expiration.getTime() - now.getTime()

  if (diffMs <= 0) {
    return "Süresi doldu"
  }

  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 60) {
    return `${diffMins} dakika`
  }

  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60

  return `${hours} saat ${mins} dakika`
}
