import { compare, hash } from "bcryptjs"
import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export interface User {
  _id?: string | ObjectId
  email: string
  password: string
  name?: string
  sessions?: string[]
  createdAt?: Date
}

export async function createUser(userData: Omit<User, "_id">): Promise<User> {
  const client = await clientPromise
  const db = client.db()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash the password
  const hashedPassword = await hash(userData.password, 12)

  // Create the user
  const result = await db.collection("users").insertOne({
    ...userData,
    password: hashedPassword,
    sessions: [],
    createdAt: new Date(),
  })

  const user = await db.collection("users").findOne({ _id: result.insertedId })
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

  const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
  return user as User | null
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
