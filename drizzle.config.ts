import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: (() => {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL must be set to run migrations')
    return {
      url,
      ...(process.env.DATABASE_AUTH_TOKEN ? { authToken: process.env.DATABASE_AUTH_TOKEN } : {}),
    }
  })(),
})
