import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { exercise } from "../models/journal"
import { eq } from "drizzle-orm"

export async function getExerciseByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const exercise = await db.query.exercise.findFirst({
    where: (model, { eq }) => eq(model.entryId, entryId)
  })

  if (!exercise) return null

  return exercise
}

export async function getExerciseByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const exercise = await db.query.exercise.findFirst({
    where: (model, { eq }) => eq(model.date, date)
  })

  if (!exercise) return null

  return exercise
}

export async function createExercise(
  date: string,
  entryId: number,
  exerciseContent: number
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbExercise = await db.query.exercise.findFirst({
    where: (model, { eq }) => eq(model.date, date)
  })

  if (dbExercise) throw new Error("Exercise already exists")

  await db
    .insert(exercise)
    .values({
      date,
      entryId,
      userId: user.userId,
      exercise: exerciseContent
    })
    .execute()
}

export async function updateExercise(
  exerciseId: number,
  exerciseContent: number
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .update(exercise)
    .set({
      exercise: exerciseContent
    })
    .where(eq(exercise.id, exerciseId))
    .execute()
}

export async function deleteExercise(exerciseId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.delete(exercise).where(eq(exercise.id, exerciseId)).execute()
}
