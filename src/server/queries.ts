import "server-only"

import { db } from "./db"
import { auth } from "@clerk/nextjs/server"

export async function getMyEntries() {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  try {
    const entries = await db.query.entries.findMany({
      where: (model, { eq }) => eq(model.userId, user.userId),
      orderBy: (model, { desc }) => desc(model.date)
    })
    return entries
  } catch (e) {
    console.log(e)
  }
  
}

export async function getMyEntry(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const entry = await db.query.entries.findFirst({
    where: (model, { eq }) => eq(model.date, date),
  })

  if (!entry) throw new Error("Entry not found")

  if (entry.userId !== user.userId) throw new Error("Unauthorized")

  return entry
}