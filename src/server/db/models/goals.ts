import {
  boolean,
  date,
  integer,
  pgSchema,
  serial,
  text,
  varchar
} from "drizzle-orm/pg-core"

export const goals = pgSchema("goals")

export const yearlyGoals = goals.table("yearly_goal", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  year: integer("year").notNull(),
  goal: text("goal").notNull(),
  checked: boolean("checked").default(false)
})

export const monthlyGoals = goals.table("monthly_goal", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  goal: text("goal").notNull(),
  checked: boolean("checked").default(false)
})

export const weeklyGoals = goals.table("weekly_goal", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  year: integer("year").notNull(),
  week: integer("week").notNull(),
  goal: text("goal").notNull(),
  checked: boolean("checked").default(false)
})

export const dailyGoals = goals.table("daily_goal", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  date: date("date").notNull(),
  goal: text("goal").notNull(),
  checked: boolean("checked").default(false)
})

export const reflections = goals.table("reflection", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  date: date("date").notNull(),
  reflection: text("reflection").notNull(),
  goalId: integer("goal_id")
    .references(() => yearlyGoals.id)
    .references(() => monthlyGoals.id)
    .references(() => weeklyGoals.id)
    .references(() => dailyGoals.id)
    .notNull()
})
