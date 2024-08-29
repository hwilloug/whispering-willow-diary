import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { entries } from "../models/journal"
import { entryDTOToContent } from "../../utils"

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
      question: true,
    }
  })

  return entries.map(e => entryDTOToContent(e))
}

export async function getMyEntry(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const entry = await db.query.entries.findFirst({
    where: (model, { eq }) => eq(model.date, date),
    with: {
      sleep: true
    }
  })

  if (!entry) return null

  if (entry.userId !== user.userId) throw new Error("Unauthorized")

  return entryDTOToContent(entry)
}

export async function createEntry(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const entry = await db.query.entries.findFirst({
    where: (model, { eq }) => eq(model.date, date),
  })

  if (entry) throw new Error("Entry already exists")

  await db.insert(entries).values({
    userId: user.userId,
    date,
  }).execute()
}