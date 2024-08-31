import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import { question } from "../models/journal"
import { eq } from "drizzle-orm"

export async function getQuestionByEntry(entryId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const question = await db.query.question.findFirst({
    where: (model, { eq }) => eq(model.entryId, entryId)
  })

  if (!question) return null

  return question
}

export async function getQuestionByDate(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const question = await db.query.question.findFirst({
    where: (model, { eq }) => eq(model.date, date)
  })

  if (!question) return null

  return question
}

export async function createQuestion(
  date: string,
  entryId: number,
  questionContent: string,
  answerContent: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbQuestion = await db.query.question.findFirst({
    where: (model, { eq }) => eq(model.date, date)
  })

  if (dbQuestion) throw new Error("Question already exists")

  await db
    .insert(question)
    .values({
      date,
      entryId,
      userId: user.userId,
      question: questionContent,
      answer: answerContent
    })
    .execute()
}

export async function updateQuestion(
  questionId: number,
  answerContent: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .update(question)
    .set({
      answer: answerContent
    })
    .where(eq(question.id, questionId))
    .execute()
}

export async function deleteQuestion(questionId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.delete(question).where(eq(question.id, questionId)).execute()
}
