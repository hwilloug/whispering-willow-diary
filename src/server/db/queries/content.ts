import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { content } from "../models/journal"
import { and, eq } from "drizzle-orm"

export async function getContentByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const content = await db.query.content.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.entryId, entryId), eq(model.userId, user.userId))
  })

  if (!content) return null

  return content
}

export async function getContentByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const content = await db.query.content.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId))
  })

  if (!content) return null

  return content
}

export async function createContent(
  date: string,
  entryId: number,
  contentContent?: string
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

export async function updateContent(
  contentId: number,
  contentContent?: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .update(content)
    .set({
      content: contentContent
    })
    .where(and(eq(content.id, contentId), eq(content.userId, user.userId)))
    .execute()
}

export async function deleteContent(contentId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.delete(content).where(eq(content.id, contentId)).execute()
}
