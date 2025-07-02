import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  uuid: uuid().primaryKey(),
});
