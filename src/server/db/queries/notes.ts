import { and, eq } from "drizzle-orm"
import { db } from "../models"
import { note } from "../models/appointments"

import { auth } from "@clerk/nextjs/server"

export const createNote = async (input?: {
  appointmentId?: number
  note?: string
}) => {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  return await db
    .insert(note)
    .values({
      appointmentId: input?.appointmentId,
      note: input?.note ?? "",
      userId: user.userId
    })
    .returning()
}

export const updateNote = async (input: { id: number; note: string }) => {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  return await db
    .update(note)
    .set(input)
    .where(and(eq(note.id, input.id), eq(note.userId, user.userId)))
    .returning()
}

export const deleteNote = async (id: number) => {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  return await db
    .delete(note)
    .where(and(eq(note.id, id), eq(note.userId, user.userId)))
    .returning()
}
