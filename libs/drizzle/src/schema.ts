import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  uuid: uuid().primaryKey().defaultRandom(),
  idpUuid: uuid('idp_uuid'),
  email: varchar('email', { length: 320 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
});

export const refreshTokens = pgTable('refresh_tokens', {
  token: varchar('token', { length: 255 }).primaryKey(),
  userUuid: uuid('user_uuid')
    .notNull()
    .references(() => users.uuid),
  expiresAt: timestamp({ withTimezone: true }),
});

export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userUuid],
    references: [users.uuid],
  }),
}));
