import "server-only"

import { db } from "./db"
import { auth } from "@clerk/nextjs/server"
import { entries } from "./db/schema"
import { EntryState } from "~/store"

export async function getMyEntries() {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const entries = await db.query.entries.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.date)
  })
  return entries  
}

export async function getMyEntry(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const entry = await db.query.entries.findFirst({
    where: (model, { eq }) => eq(model.date, date),
  })

  if (!entry) return null

  if (entry.userId !== user.userId) throw new Error("Unauthorized")

  return entry
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

export async function updateEntry(date: string, content: Partial<EntryState>) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.update(entries).set({ date, userId: user.userId, ...removeUndefined(contentToDTO(content)) }).execute()
}

function contentToDTO(content: Partial<EntryState>) {
  return {
    mood: content.mood,
    hoursSleep: content.hoursSleep,
    bedTime: content.bedTime,
    wakeUpTime: content.wakeUpTime,
    sleepQuality: content.sleepQuality,
    affirmation: content.affirmation,
    mentalHealth: JSON.stringify(content.mentalHealth),
    feelings: JSON.stringify(content.feelings),
    substances: JSON.stringify(content.substances),
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