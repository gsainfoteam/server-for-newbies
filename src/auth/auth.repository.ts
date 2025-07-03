import * as schema from '@lib/drizzle/schema';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findUserByUuid(
    uuid: string,
  ): Promise<typeof schema.users.$inferSelect | undefined> {
    return this.db.query.users.findFirst({
      where: eq(schema.users.uuid, uuid),
    });
  }

  async findUserByEmail(
    email: string,
  ): Promise<typeof schema.users.$inferSelect | undefined> {
    return this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  }

  async findRefreshToken(
    token: string,
  ): Promise<typeof schema.refreshTokens.$inferSelect | undefined> {
    return this.db.query.refreshTokens.findFirst({
      where: eq(schema.refreshTokens.token, token),
    });
  }

  async createUserWithPassword(
    user: Omit<typeof schema.users.$inferInsert, 'uuid' | 'idpUuid'>,
  ): Promise<typeof schema.users.$inferSelect> {
    return (
      await this.db
        .insert(schema.users)
        .values({
          email: user.email,
          password: user.password,
        })
        .returning()
        .catch(() => {
          throw new InternalServerErrorException();
        })
    )[0];
  }

  async createUserWithIdp(
    user: Omit<typeof schema.users.$inferInsert, 'uuid' | 'password'>,
  ): Promise<typeof schema.users.$inferSelect> {
    return (
      await this.db
        .insert(schema.users)
        .values({
          email: user.email,
          idpUuid: user.idpUuid,
        })
        .returning()
        .catch(() => {
          throw new InternalServerErrorException();
        })
    )[0];
  }

  async createRefreshToken({
    token,
    userUuid,
    expiresAt,
  }: typeof schema.refreshTokens.$inferInsert): Promise<
    typeof schema.refreshTokens.$inferSelect
  > {
    return (
      await this.db
        .insert(schema.refreshTokens)
        .values({
          token,
          userUuid,
          expiresAt,
        })
        .returning()
        .catch(() => {
          throw new InternalServerErrorException();
        })
    )[0];
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.db
      .delete(schema.refreshTokens)
      .where(eq(schema.refreshTokens.token, token));
  }
}
