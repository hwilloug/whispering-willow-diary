import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { content } from "../models/journal"
import { eq } from "drizzle-orm"

export async function getContentByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const content = await db.query.content.findMany({
    where: (model, { eq }) => eq(model.entryId, entryId)
  })

  if (!content) return null

  return content
}

export async function getContentByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const content = await db.query.content.findMany({
    where: (model, { eq }) => eq(model.date, date)
  })

  if (!content) return null

  return content
}

export async function createContent(
  date: string,
  entryId: number,
  contentContent: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .insert(content)
    .values({
      date,
      entryId,
      userId: user.userId,
      content: contentContent
    })
    .execute()
}

export async function updateSubstance(
  contentId: number,
  contentContent: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .update(content)
    .set({
      content: contentContent
    })
    .where(eq(content.id, contentId))
    .execute()
}

export async function deleteSubstance(contentId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.delete(content).where(eq(content.id, contentId)).execute()
}
