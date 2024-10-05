import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { entries } from "../models/journal"
import { entryDTOToContent } from "~/server/utils"
import { eq } from "drizzle-orm"

export async function getMyEntries() {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const entries = await db.query.entries.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.date),
    with: {
      sleep: true,
      affirmation: true,
      mentalHealth: true,
      feelings: true,
      substances: true,
      content: true,
      mood: true,
      exercise: true,
      answer: true
    }
  })

  return entries.map((e) => entryDTOToContent(e))
}

export async function getMyEntry(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const entry = await db.query.entries.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId))
  })

  if (!entry) return null

  if (entry.userId !== user.userId) throw new Error("Unauthorized")

  return entryDTOToContent(entry)
}

export async function createEntry(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const entry = await db.query.entries.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId))
  })

  if (entry) throw new Error("Entry already exists")

  await db
    .insert(entries)
    .values({
      userId: user.userId,
      date
    })
    .execute()
}

export async function deleteEntry(id: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbEntry = await db.query.entries.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.id, id), eq(model.userId, user.userId))
  })

  if (!dbEntry) throw new Error("Entry not found")

  await db.delete(entries).where(eq(entries.id, id)).execute()
}
