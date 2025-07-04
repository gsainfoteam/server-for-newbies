import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DRIZZLE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return drizzle(configService.getOrThrow<string>('DATABASE_URL'), {
          schema,
        });
      },
    },
  ],
  exports: ['DRIZZLE'],
})
export class DrizzleModule {}
