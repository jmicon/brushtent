import NextAuth from "next-auth"
// OAuth Providers
import GitHubProvider from "next-auth/providers/github";

// PostgreSQL Adapter
import PostgresAdapter from "@auth/pg-adapter"
// import type { Adapter } from "@auth/core/adapters"

import { Pool } from "pg"

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore
  adapter: PostgresAdapter(pool),
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string
    })
  ],
  secret: process.env.AUTH_SECRET,
})
