import { defineConfig } from "drizzle-kit"

import { env } from "~/env"

export default defineConfig({
  schema: ["./src/server/db/models/*"],
  schemaFilter: ["public", "journal", "goals", "habits", "users"],
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL
  },
  out: "./src/server/db/migrations/*"
})
