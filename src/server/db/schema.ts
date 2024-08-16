// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  json,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `${name}`);

export const entries = createTable(
  "entry",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    date: date("date").default(sql`CURRENT_TIMESTAMP`).notNull(),
    mood: integer("mood"),
    affirmation: varchar("affirmation", { length: 1024 }),
    mentalHealth: varchar("mental_health", { length: 1024 }),
    feelings: varchar("feelings", { length: 1024 }),
    substances: json("substances"),
    entryContent: text("entry_content"),
    morningEntryContent: text("morning_entry_content"),
    dailyQuestionQ: varchar("daily_question_q", { length: 256 }),
    dailyQuestionA: text("daily_question_a"),
    minutesExercise: integer("minutes_exercise"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
)

export const entryRelations = relations(entries, ({ many }) => ({
  sleep: many(sleep, { relationName: "sleep_entry" }),
}))

export const sleep = createTable(
  "sleep",
  {
    id: serial("id").primaryKey(),
    entryId: integer("entry_id").references(() => entries.id),
    bedTime: timestamp("bed_time", { withTimezone: true }),
    wakeUpTime: timestamp("wake_up_time", { withTimezone: true }),
    sleepQuality: varchar("sleep_quality", { length: 256 }),
    hoursSleep: numeric("hours_sleep", { precision: 2 }),
  }
)

export const sleepRelations = relations(sleep, ({ one }) => ({
  entry: one(entries, {
    fields: [sleep.entryId],
    references: [entries.id],
    relationName: "sleep_entry",
  })
}))

export const yearlyGoals = createTable(
  "yearly_goal",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    year: integer("year").notNull(),
    goal: text("goal").notNull(),
    checked: boolean("checked").default(false)
  }
)

export const monthlyGoals = createTable(
  "monthly_goal",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    goal: text("goal").notNull(),
    checked: boolean("checked").default(false)
  }
)

export const weeklyGoals = createTable(
  "weekly_goal",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    year: integer("year").notNull(),
    week: integer("week").notNull(),
    goal: text("goal").notNull(),
    checked: boolean("checked").default(false)
  }
)

export const dailyGoals = createTable(
  "daily_goal",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    entryId: serial("entry_id").references(() => entries.id),
    goal: text("goal").notNull(),
    checked: boolean("checked").default(false)
  }
)