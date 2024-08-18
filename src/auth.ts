import NextAuth from "next-auth"
// OAuth Providers
import GitHubProvider from "next-auth/providers/github";

// PostgreSQL Adapter
import PostgresAdapter from "@auth/pg-adapter"
// import type { Adapter } from "@auth/core/adapters"

import { Pool } from "pg"

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore
  adapter: PostgresAdapter(pool),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    })
  ],
  secret: process.env.AUTH_SECRET,
})
