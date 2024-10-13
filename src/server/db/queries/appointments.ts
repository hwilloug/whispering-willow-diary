import { auth } from "@clerk/nextjs/server"
import { db } from "../models"
import { appointment } from "../models/appointments"
import { and, eq } from "drizzle-orm"

export const getMyAppointments = async () => {
  const appointments = await db.query.appointment.findMany({
    with: { notes: true }
  })

  return appointments
}

export const createAppointment = async ({
  date,
  title,
  description
}: {
  date: string
  title: string
  description: string
}) => {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const [newAppointment] = await db
    .insert(appointment)
    .values({
      date: date,
      title,
      description,
      userId: user.userId
    })
    .returning()

  return newAppointment
}

export const updateAppointment = async ({
  appointmentId,
  date,
  title,
  description
}: {
  appointmentId: number
  date: Date
  title: string
  description: string
}) => {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db
    .update(appointment)
    .set({ date: date.toISOString(), title, description })
    .where(
      and(
        eq(appointment.id, appointmentId),
        eq(appointment.userId, user.userId)
      )
    )
    .execute()
}

export const deleteAppointment = async (id: number) => {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  await db.delete(appointment).where(eq(appointment.id, id)).execute()
}
