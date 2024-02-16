import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"

import { Database } from "./types"

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_CONNECTION_STRING,
    max: 10,
  }),
})

export const db = new Kysely<Database>({ dialect })
