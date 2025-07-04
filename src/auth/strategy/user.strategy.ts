import * as schema from '@lib/drizzle/schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user:jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate({
    sub,
  }: {
    sub: string;
  }): Promise<typeof schema.users.$inferSelect> {
    if (!sub) throw new UnauthorizedException('Invalid token');
    const user = await this.authService.getUserByUuid(sub);
    if (!user) throw new UnauthorizedException('Invalid user');
    return user;
  }
}
