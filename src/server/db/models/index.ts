import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { env } from "~/env"
import * as journal from "./journal"
import * as appointments from "./appointments"
import * as goals from "./goals"
/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined
}

const conn =
  globalForDb.conn ??
  postgres(env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
    max: 10
  })
if (env.NODE_ENV !== "production") globalForDb.conn = conn

export const db = drizzle(conn, {
  schema: { ...journal, ...appointments, ...goals }
})
