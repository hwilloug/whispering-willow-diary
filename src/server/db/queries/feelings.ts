import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { affirmation, feelings } from "../models/journal"
import { and, eq } from "drizzle-orm"

export async function getFeelingsByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const feelings = await db.query.feelings.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.entryId, entryId), eq(model.userId, user.userId))
  })

  if (!feelings) return null

  return feelings
}

export async function getFeelingsByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const feelings = await db.query.feelings.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId))
  })

  if (!feelings) return null

  return feelings
}

export async function createFeelings(
  date: string,
  entryId: number,
  feelingsContent: string[]
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbFeelings = await db.query.feelings.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId))
  })

  if (dbFeelings) throw new Error("Feelings already exists")

  await db
    .insert(feelings)
    .values({
      date,
      entryId,
      userId: user.userId,
      feelings: feelingsContent
    })
    .execute()
}

export async function updateFeelings(
  feelingsId: number,
  feelingsContent: string[]
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .update(feelings)
    .set({
      feelings: feelingsContent
    })
    .where(and(eq(feelings.id, feelingsId), eq(feelings.userId, user.userId)))
    .execute()
}

export async function deleteFeelings(feelingsId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.delete(feelings).where(eq(feelings.id, feelingsId)).execute()
}
