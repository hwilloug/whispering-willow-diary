import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { substances } from "../models/journal"
import { and, eq } from "drizzle-orm"

export async function getMySubstances() {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const substances = await db.query.substances.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId)
  })

  if (!substances) return null

  return substances
}

export async function getSubstancesByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const substances = await db.query.substances.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.entryId, entryId), eq(model.userId, user.userId))
  })

  if (!substances) return null

  return substances
}

export async function getSubstancesByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const substances = await db.query.substances.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId))
  })

  if (!substances) return null

  return substances
}

export async function createSubstances(
  date: string,
  entryId: number,
  substanceName: string,
  substanceAmount: number
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .insert(substances)
    .values({
      date,
      entryId,
      userId: user.userId,
      substance: substanceName,
      amount: substanceAmount
    })
    .execute()
}

export async function updateSubstance(
  substanceId: number,
  substanceAmount: number
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .update(substances)
    .set({
      amount: substanceAmount
    })
    .where(
      and(eq(substances.id, substanceId), eq(substances.userId, user.userId))
    )
    .execute()
}

export async function deleteSubstance(substanceId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.delete(substances).where(eq(substances.id, substanceId)).execute()
}
