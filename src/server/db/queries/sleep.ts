import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { sleep } from "../models/journal"
import { eq } from "drizzle-orm"
import { parse } from "date-fns"

export async function getMySleep() {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const sleeps = await db.query.sleep.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId)
  })

  if (!sleeps) return null

  return sleeps
}

export async function getSleepByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const sleep = await db.query.sleep.findMany({
    where: (model, { eq }) => eq(model.entryId, entryId)
  })

  if (!sleep) return null

  return sleep
}

export async function getSleepByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const sleep = await db.query.sleep.findMany({
    where: (model, { eq }) => eq(model.date, date)
  })

  if (!sleep) return null

  return sleep
}

export async function createSleep(
  date: string,
  entryId: number,
  bedTime?: Date,
  wakeUpTime?: Date,
  sleepQuality?: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .insert(sleep)
    .values({
      date,
      entryId,
      userId: user.userId,
      bedTime,
      wakeUpTime,
      sleepQuality
    })
    .execute()
}

export async function updateSleep(
  sleepId: number,
  bedTime?: string,
  wakeUpTime?: string,
  sleepQuality?: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbSleep = await db.query.sleep.findFirst({
    where: (model, { eq }) => eq(model.id, sleepId)
  })

  if (!dbSleep) throw new Error("Sleep not found")

  await db
    .update(sleep)
    .set({
      bedTime: parseTimeValue(bedTime) ?? dbSleep.bedTime,
      wakeUpTime: parseTimeValue(wakeUpTime) ?? dbSleep.wakeUpTime,
      sleepQuality: sleepQuality ?? dbSleep.sleepQuality
    })
    .where(eq(sleep.id, sleepId))
    .execute()
}

export async function deleteSleep(sleepId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.delete(sleep).where(eq(sleep.id, sleepId)).execute()
}

const parseTimeValue = (date?: string | null) => {
  return date ? parse(date, "HH:mm", new Date()) : undefined
}
