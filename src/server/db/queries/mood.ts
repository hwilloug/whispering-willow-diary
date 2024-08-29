import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { mood } from "../models/journal"
import { eq } from "drizzle-orm"


export async function getMyMoods() {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const moods = await db.query.mood.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
  })

  if (!moods) return null

  return moods
}

export async function getMoodByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const mood = await db.query.mood.findFirst({
    where: (model, { eq }) => eq(model.entryId, entryId),
  })

  if (!mood) return null

  return mood
}

export async function getMoodByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const mood = await db.query.mood.findFirst({
    where: (model, { eq }) => eq(model.date, date),
  })

  if (!mood) return null

  return mood
}

export async function createMood(date: string, entryId: number, moodContent: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbMood = await db.query.mood.findFirst({
    where: (model, { eq }) => eq(model.date, date),
  })

  if (dbMood) throw new Error("Mood already exists")

  await db.insert(mood).values({
    date,
    entryId,
    userId: user.userId,
    mood: moodContent
  }).execute()
}

export async function updateMood(moodId: number, moodContent: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.update(mood).set({
    mood: moodContent
  }).where(eq(mood.id, moodId)).execute()
}

export async function deleteMood(moodId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.delete(mood).where(eq(mood.id, moodId)).execute()
}