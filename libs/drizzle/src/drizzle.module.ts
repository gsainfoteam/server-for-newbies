import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DRIZZLE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return drizzle(configService.getOrThrow<string>('DATABASE_URL'));
      },
    },
  ],
  exports: ['DRIZZLE'],
})
export class DrizzleModule {}
