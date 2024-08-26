import "server-only"

import { db } from "./db/models"
import { auth } from "@clerk/nextjs/server"
import { entries, sleep } from "./db/models/journal"
import { EntryState, SleepState } from "~/store"
import { eq } from "drizzle-orm"
import { format, parse } from "date-fns"

export async function getMyEntries() {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const entries = await db.query.entries.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.date),
    with: {
      sleep: true
    }
  })  
  return entries.map(e => dtoToContent(e))
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

  return dtoToContent(entry)
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

export async function updateEntry(entryId: number, date: string, content: Partial<EntryState>) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.update(entries).set({ date, userId: user.userId, ...removeUndefined(contentToDTO(content)) }).where(eq(entries.date, date)).execute()
  if (content.sleep) {
    if (content.sleep.length === 0) {
      await db.delete(sleep).where(eq(sleep.entryId, entryId)).execute()
    } else {
      await db.delete(sleep).where(eq(sleep.entryId, entryId)).execute()
      // @ts-ignore
      await db.insert(sleep).values(content.sleep.map(s => sleepContentToDTO(date, entryId, s))).execute()
    }
  }
}

export async function deleteSleep(id: number) {
  await db.delete(sleep).where(eq(sleep.id, id)).execute()
}

function contentToDTO(content: Partial<EntryState>) {
  return {
    mood: content.mood,
    affirmation: content.affirmation,
    mentalHealth: JSON.stringify(content.mentalHealth),
    feelings: JSON.stringify(content.feelings),
    substances: content.substances,
    entryContent: content.entryContent,
    morningEntryContent: content.morningEntryContent,
    dailyQuestionQ: content.dailyQuestionQ,
    dailyQuestionA: content.dailyQuestionA,
    minutesExercise: content.exercise,
  }
}

function removeUndefined(dto: Record<string, any>) {
  return Object.fromEntries(Object.entries(dto).filter(([_, v]) => v !== undefined))
}

function dtoToContent(dto: Record<string, any>): EntryState {
  return {
    id: dto.id,
    date: dto.date,
    mood: dto.mood,
    sleep: dto.sleep.map((s: Record<string, any>) => ({
      id: s.id,
      hoursSleep: s.hoursSleep,
      bedTime: s.bedTime ? format(s.bedTime, "HH:mm") : undefined,
      wakeUpTime: s.wakeUpTime ? format(s.wakeUpTime, "HH:mm") : undefined,
      sleepQuality: s.sleepQuality,
    })),
    affirmation: dto.affirmation,
    mentalHealth: JSON.parse(dto.mentalHealth || "[]"),
    feelings: JSON.parse(dto.feelings || "[]"),
    substances: dto.substances,
    entryContent: dto.entryContent,
    morningEntryContent: dto.morningEntryContent,
    dailyQuestionQ: dto.dailyQuestionQ,
    dailyQuestionA: dto.dailyQuestionA,
    exercise: dto.minutesExercise,
  }
}

function sleepContentToDTO(date: string, entryId: number, sleep: Partial<SleepState>) {
  return {
    entryId,
    date,
    hoursSleep: sleep.hoursSleep,
    bedTime: sleep.bedTime ? parse(sleep.bedTime, "HH:mm", new Date()) : undefined,
    wakeUpTime: sleep.wakeUpTime ? parse(sleep.wakeUpTime, "HH:mm", new Date()) : undefined,
    sleepQuality: sleep.sleepQuality,
  }
}