import { DrizzleModule } from '@lib/drizzle';
import { InfoteamIdpModule } from '@lib/infoteam-idp';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserGuard } from './guards/user.guard';
import { UserStrategy } from './strategy/user.strategy';
import { LoggerModule } from '@lib/logger';

@Module({
  imports: [
    LoggerModule,
    DrizzleModule,
    InfoteamIdpModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn:
            configService.getOrThrow<number>('ACCESS_TOKEN_EXPIRES_IN') * 1000, // Convert seconds to milliseconds
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, UserGuard, UserStrategy],
  exports: [UserGuard, UserStrategy],
})
export class AuthModule {}
