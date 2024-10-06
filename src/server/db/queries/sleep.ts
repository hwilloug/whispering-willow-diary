import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { sleep } from "../models/journal"
import { and, eq } from "drizzle-orm"
import { parse } from "date-fns"

export async function getMySleep() {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const sleeps = await db
    .select({
      date: sleep.date,
      bedTime: sleep.bedTime,
      wakeUpTime: sleep.wakeUpTime
    })
    .from(sleep)
    .where(eq(sleep.userId, user.userId))
    .groupBy(sleep.date, sleep.id)

  if (!sleeps) return null

  return sleeps
}

export async function getSleepByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const sleep = await db.query.sleep.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.entryId, entryId), eq(model.userId, user.userId))
  })

  if (!sleep) return null

  return sleep
}

export async function getSleepByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const sleep = await db.query.sleep.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId))
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
    where: (model, { eq, and }) =>
      and(eq(model.id, sleepId), eq(model.userId, user.userId))
  })

  if (!dbSleep) throw new Error("Sleep not found")

  await db
    .update(sleep)
    .set({
      bedTime: parseTimeValue(bedTime) ?? dbSleep.bedTime,
      wakeUpTime: parseTimeValue(wakeUpTime) ?? dbSleep.wakeUpTime,
      sleepQuality: sleepQuality ?? dbSleep.sleepQuality
    })
    .where(and(eq(sleep.id, sleepId), eq(sleep.userId, user.userId)))
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
