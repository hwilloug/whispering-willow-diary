import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { affirmation } from "../models/journal"
import { and, eq } from "drizzle-orm"
import { PgDateString } from "drizzle-orm/pg-core"

export async function getAffirmationByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const affirmation = await db.query.affirmation.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.entryId, entryId), eq(model.userId, user.userId))
  })

  if (!affirmation) return null

  return affirmation
}

export async function getAffirmationByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const affirmation = await db.query.affirmation.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId))
  })

  if (!affirmation) return null

  return affirmation
}

export async function createAffirmation(
  date: string,
  entryId: number,
  affirmationContent: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbAffirmation = await db.query.affirmation.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId))
  })

  if (dbAffirmation) throw new Error("Affirmation already exists")

  await db
    .insert(affirmation)
    .values({
      date,
      entryId,
      userId: user.userId,
      affirmation: affirmationContent
    })
    .execute()
}

export async function updateAffirmation(
  affirmationId: number,
  affirmationContent: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .update(affirmation)
    .set({
      affirmation: affirmationContent
    })
    .where(
      and(
        eq(affirmation.id, affirmationId),
        eq(affirmation.userId, user.userId)
      )
    )
    .execute()
}

export async function deleteAffirmation(affirmationId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .delete(affirmation)
    .where(eq(affirmation.id, affirmationId))
    .execute()
}
