import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { mentalHealth } from "../models/journal"
import { eq } from "drizzle-orm"

export async function getMentalHealthByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const mentalHealth = await db.query.mentalHealth.findFirst({
    where: (model, { eq }) => eq(model.entryId, entryId)
  })

  if (!mentalHealth) return null

  return mentalHealth
}

export async function getMentalHealthByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const mentalHealth = await db.query.mentalHealth.findFirst({
    where: (model, { eq }) => eq(model.date, date)
  })

  if (!mentalHealth) return null

  return mentalHealth
}

export async function createMentalHealth(
  date: string,
  entryId: number,
  mentalHealthContent: string[]
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbMentalHealth = await db.query.mentalHealth.findFirst({
    where: (model, { eq }) => eq(model.date, date)
  })

  if (dbMentalHealth) throw new Error("Mental health already exists")

  await db
    .insert(mentalHealth)
    .values({
      date,
      entryId,
      userId: user.userId,
      mentalHealth: mentalHealthContent
    })
    .execute()
}

export async function updateMentalHealth(
  mentalHealthId: number,
  mentalHealthContent: string[]
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .update(mentalHealth)
    .set({
      mentalHealth: mentalHealthContent
    })
    .where(eq(mentalHealth.id, mentalHealthId))
    .execute()
}

export async function deleteMentalHealth(mentalHealthId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .delete(mentalHealth)
    .where(eq(mentalHealth.id, mentalHealthId))
    .execute()
}
