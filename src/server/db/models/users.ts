import { json, pgSchema, serial, text, varchar } from "drizzle-orm/pg-core"

export const users = pgSchema("users")

export const preference = users.table("preference", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  preferences: json("preferences").notNull(),
  substances: text("substances").array()
})
