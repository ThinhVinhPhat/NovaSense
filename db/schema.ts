import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', { enum: ['click', 'scroll'] }).notNull(),
  path: text('path').notNull(),
  label: text('label'),
  depth: integer('depth'),
  ts: integer('ts').notNull().$defaultFn(() => Date.now()),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})
