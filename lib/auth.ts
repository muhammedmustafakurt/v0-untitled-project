import { compare, hash } from "bcryptjs"
import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"

export interface User {
  _id?: string | ObjectId
  email: string
  password: string
  name?: string
  sessions?: string[]
  balance?: number
  isAdmin?: boolean
  createdAt?: Date
}

export async function createUser(userData: Omit<User, "_id">): Promise<User> {
  const client = await clientPromise
  const db = client.db()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("Bu e-posta adresi zaten kullanılıyor")
  }

  // Hash the password
  const hashedPassword = await hash(userData.password, 12)

  // Create the user with initial balance
  const result = await db.collection("users").insertOne({
    ...userData,
    password: hashedPassword,
    sessions: [],
    balance: 0, // Başlangıç bakiyesi 0
    isAdmin: false, // Varsayılan olarak admin değil
    createdAt: new Date(),
  })

  const user = await db.collection("users").findOne({ _id: result.insertedId })
  if (!user) {
    throw new Error("Kullanıcı oluşturulamadı")
  }
  return user as User
}

// Admin kullanıcı oluşturma fonksiyonu
export async function createAdminUser(userData: Omit<User, "_id">): Promise<User> {
  const client = await clientPromise
  const db = client.db()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("Bu e-posta adresi zaten kullanılıyor")
  }

  // Hash the password
  const hashedPassword = await hash(userData.password, 12)

  // Create the user with admin privileges
  const result = await db.collection("users").insertOne({
    ...userData,
    password: hashedPassword,
    sessions: [],
    balance: 1000, // Admin için başlangıç bakiyesi
    isAdmin: true, // Admin yetkisi
    createdAt: new Date(),
  })

  const user = await db.collection("users").findOne({ _id: result.insertedId })
  if (!user) {
    throw new Error("Admin kullanıcı oluşturulamadı")
  }
  return user as User
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ email })
  return user as User | null
}

export async function findUserById(id: string): Promise<User | null> {
  const client = await clientPromise
  const db = client.db()

  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
    return user as User | null
  } catch (error) {
    console.error("Error finding user by ID:", error)
    return null
  }
}

export async function validatePassword(user: User, password: string): Promise<boolean> {
  return compare(password, user.password)
}

export async function addSessionToUser(userId: string, sessionId: string): Promise<void> {
  const client = await clientPromise
  const db = client.db()

  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $addToSet: { sessions: sessionId } })
}

export async function getUserSessions(userId: string): Promise<string[]> {
  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
  return (user?.sessions || []) as string[]
}

// Bakiye işlemleri
export async function getUserBalance(userId: string): Promise<number> {
  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
  return user?.balance || 0
}

export async function updateUserBalance(userId: string, amount: number): Promise<number> {
  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
  if (!user) {
    throw new Error("Kullanıcı bulunamadı")
  }

  const newBalance = (user.balance || 0) + amount

  // Bakiye negatif olamaz
  if (newBalance < 0) {
    throw new Error("Yetersiz bakiye")
  }

  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { balance: newBalance } })

  return newBalance
}

// Numara kiralama için bakiye kontrolü ve düşme
export async function deductBalanceForRental(userId: string, amount: number): Promise<number> {
  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
  if (!user) {
    throw new Error("Kullanıcı bulunamadı")
  }

  const currentBalance = user.balance || 0
  if (currentBalance < amount) {
    throw new Error("Yetersiz bakiye")
  }

  const newBalance = currentBalance - amount
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { balance: newBalance } })

  return newBalance
}

// Admin işlemleri
export async function getAllUsers(): Promise<User[]> {
  const client = await clientPromise
  const db = client.db()

  const users = await db.collection("users").find({}).toArray()
  return users as User[]
}

export async function makeUserAdmin(userId: string): Promise<void> {
  const client = await clientPromise
  const db = client.db()

  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { isAdmin: true } })
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const client = await clientPromise
  const db = client.db()

  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    return !!user?.isAdmin
  } catch (error) {
    console.error("Error checking if user is admin:", error)
    return false
  }
}

// Session yönetimi
export async function setAuthCookie(token: string) {
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export async function clearAuthCookie() {
  cookies().set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}
