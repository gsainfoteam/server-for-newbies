import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  uuid: uuid().primaryKey().defaultRandom(),
  idpUuid: uuid('idp_uuid'),
  email: varchar('email', { length: 320 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
});

export const refreshTokens = pgTable('refresh_tokens', {
  token: varchar('token', { length: 255 }).primaryKey(),
  userUuid: uuid('user_uuid').notNull(),
  expiresAt: timestamp({ withTimezone: true }),
});
