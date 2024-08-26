import { defineConfig } from "drizzle-kit";

import { env } from "~/env";

export default defineConfig({
  schema: ["./src/server/db/models/*"],
  schemaFilter: ["public", "journal", "goals", "habits", "users"],
  dialect: "postgresql",
  dbCredentials: {
    host: env.DATABASE_URL,
    port: parseInt(env.DATABASE_PORT),
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_DATABASE,
  },
  out: "./src/server/db/migrations/*",
})
