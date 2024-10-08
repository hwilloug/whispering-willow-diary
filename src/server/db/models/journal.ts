// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm"
import {
  boolean,
  integer,
  pgSchema,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const journal = pgSchema("journal")

export const entries = journal.table("entry", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  date: varchar("date", { length: 10 })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
})

export const entryRelations = relations(entries, ({ many, one }) => ({
  sleep: many(sleep),
  affirmation: one(affirmation),
  mentalHealth: one(mentalHealth),
  feelings: one(feelings),
  substances: many(substances),
  mood: one(mood),
  exercise: one(exercise),
  content: many(content),
  answer: one(answer)
}))

export const sleep = journal.table("sleep", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 10 }).notNull(),
  entryId: integer("entry_id")
    .references(() => entries.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  bedTime: timestamp("bed_time", { withTimezone: true }),
  wakeUpTime: timestamp("wake_up_time", { withTimezone: true }),
  sleepQuality: varchar("sleep_quality", { length: 256 })
})

export const sleepRelations = relations(sleep, ({ one }) => ({
  entry: one(entries, {
    fields: [sleep.entryId],
    references: [entries.id]
  })
}))

export const affirmation = journal.table("affirmation", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id")
    .references(() => entries.id, { onDelete: "cascade" })
    .notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  affirmation: text("affirmation").notNull()
})

export const affirmationRelations = relations(affirmation, ({ one }) => ({
  entry: one(entries, {
    fields: [affirmation.entryId],
    references: [entries.id]
  })
}))

export const mentalHealth = journal.table("mental_health", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id")
    .references(() => entries.id, { onDelete: "cascade" })
    .notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  mentalHealth: text("mental_health").array().notNull()
})

export const mentalHealthRelations = relations(mentalHealth, ({ one }) => ({
  entry: one(entries, {
    fields: [mentalHealth.entryId],
    references: [entries.id]
  })
}))

export const feelings = journal.table("feelings", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id")
    .references(() => entries.id, { onDelete: "cascade" })
    .notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  feelings: text("feelings").array().notNull()
})

export const feelingsRelations = relations(feelings, ({ one }) => ({
  entry: one(entries, {
    fields: [feelings.entryId],
    references: [entries.id]
  })
}))

export const substances = journal.table("substances", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id")
    .references(() => entries.id, { onDelete: "cascade" })
    .notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  substance: text("substance").notNull(),
  amount: integer("amount").notNull().default(0)
})

export const substancesRelations = relations(substances, ({ one }) => ({
  entry: one(entries, {
    fields: [substances.entryId],
    references: [entries.id]
  })
}))

export const mood = journal.table("mood", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id")
    .references(() => entries.id, { onDelete: "cascade" })
    .notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  mood: integer("mood").notNull()
})

export const moodRelations = relations(mood, ({ one }) => ({
  entry: one(entries, {
    fields: [mood.entryId],
    references: [entries.id]
  })
}))

export const refQuestion = journal.table("ref_question", {
  id: serial("id").primaryKey(),
  dayOfMonth: integer("day_of_month").notNull(),
  question: text("question").notNull(),
  active: boolean("active").default(true)
})

export const questionRelations = relations(refQuestion, ({ many }) => ({
  answer: many(answer)
}))

export const answer = journal.table("answer", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id")
    .references(() => entries.id, { onDelete: "cascade" })
    .notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  questionId: integer("question_id")
    .references(() => refQuestion.id)
    .notNull(),
  answer: text("answer").notNull()
})

export const answerRelations = relations(answer, ({ one }) => ({
  entry: one(entries, {
    fields: [answer.entryId],
    references: [entries.id]
  }),
  question: one(refQuestion, {
    fields: [answer.questionId],
    references: [refQuestion.id]
  })
}))

export const exercise = journal.table("exercise", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id")
    .references(() => entries.id, { onDelete: "cascade" })
    .notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  exercise: integer("exercise").notNull()
})

export const exerciseRelations = relations(exercise, ({ one }) => ({
  entry: one(entries, {
    fields: [exercise.entryId],
    references: [entries.id]
  })
}))

export const content = journal.table("content", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id")
    .references(() => entries.id, { onDelete: "cascade" })
    .notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  )
})

export const contentRelations = relations(content, ({ one }) => ({
  entry: one(entries, {
    fields: [content.entryId],
    references: [entries.id]
  })
}))
