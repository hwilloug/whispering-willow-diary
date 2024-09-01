import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { answer } from "../models/journal"
import { eq } from "drizzle-orm"

export async function getAnswerByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const question = await db.query.answer.findFirst({
    where: (model, { eq }) => eq(model.entryId, entryId),
    with: {
      question: true
    }
  })

  if (!question) return null

  return question
}

export async function getAnswerByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const question = await db.query.answer.findFirst({
    where: (model, { eq }) => eq(model.date, date),
    with: {
      question: true
    }
  })

  if (!question) return null

  return question
}

export async function createAnswer(
  date: string,
  entryId: number,
  questionId: number,
  answerContent: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbAnwswer = await db.query.answer.findFirst({
    where: (model, { eq }) => eq(model.date, date)
  })

  if (dbAnwswer) throw new Error("Answer already exists")

  await db
    .insert(answer)
    .values({
      date,
      entryId,
      userId: user.userId,
      questionId: questionId,
      answer: answerContent
    })
    .execute()
}

export async function updateAnswer(id: number, answerContent: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .update(answer)
    .set({
      answer: answerContent
    })
    .where(eq(answer.id, id))
    .execute()
}

export async function deleteAnswer(id: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.delete(answer).where(eq(answer.id, id)).execute()
}
