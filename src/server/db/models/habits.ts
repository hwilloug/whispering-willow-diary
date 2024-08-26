import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgSchema,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";


export const habits = pgSchema("habits")


export const habit = habits.table(
  "habit",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    habit: text("habit").notNull(),
    createdAt: date("created_at").notNull(),
    updatedAt: date("updated_at").notNull(),
    deletedAt: date("deleted_at"),
  }
)

export const habitRelations = relations(habit, ({ many }) => ({
  habitCheck: many(habitCheck),
}))

export const habitCheck = habits.table(
  "habit_check",
  {
    id: serial("id").primaryKey(),
    habitId: integer("habit_id").references(() => habit.id),
    date: date("date").notNull(),
    checked: boolean("checked").default(false),
  }
)

export const habitCheckRelations = relations(habitCheck, ({ one }) => ({
  entry: one(habit, {
    fields: [habitCheck.habitId],
    references: [habit.id],
  })
}))