import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { answer } from "../models/journal"
import { eq } from "drizzle-orm"

export async function getQuestion(dayOfMonth: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const question = await db.query.refQuestion.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.dayOfMonth, dayOfMonth), eq(model.active, true))
  })

  if (!question) return

  return question
}

export async function getAnswerByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const answer = await db.query.answer.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.entryId, entryId), eq(model.userId, user.userId)),
    with: {
      question: true
    }
  })

  if (!answer) return

  return answer
}

export async function getAnswerByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const answer = await db.query.answer.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId)),
    with: {
      question: true
    }
  })

  if (!answer) return

  return answer
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
    where: (model, { eq, and }) =>
      and(eq(model.date, date), eq(model.userId, user.userId))
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
