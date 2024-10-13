import { relations } from "drizzle-orm"
import {
  date,
  integer,
  pgSchema,
  serial,
  text,
  varchar
} from "drizzle-orm/pg-core"

export const appointments = pgSchema("appointments")

export const appointment = appointments.table("appointment", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  date: date("date").notNull(),
  title: text("title").notNull(),
  description: text("description")
})

export const note = appointments.table("note", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  appointmentId: integer("appointment_id").references(() => appointment.id),
  note: text("note").notNull()
})

export const appointmentRelations = relations(appointment, ({ many }) => ({
  notes: many(note)
}))

export const noteRelations = relations(note, ({ one }) => ({
  appointment: one(appointment, {
    fields: [note.appointmentId],
    references: [appointment.id]
  })
}))
