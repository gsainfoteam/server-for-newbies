import * as schema from '@lib/drizzle/schema';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { InfoteamIdpCredential } from './types/infoteamIdpCredential.type';
import { PasswordCredential } from './types/passwordCredential.type';
import { TokenResDto } from './dto/res/tokenRes.dto';
import { InfoteamIdpService } from '@lib/infoteam-idp';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LogoutReqDto } from './dto/req/logoutReq.dto';
import { RefreshReqDto } from './dto/req/refreshReq.dto';
import { SignupReqDto } from './dto/req/signupReq.dto';
import { Loggable } from '@lib/logger';

@Loggable()
@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly infoteamIdpService: InfoteamIdpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.accessTokenExpiresIn = this.configService.getOrThrow<number>(
      'ACCESS_TOKEN_EXPIRES_IN',
    );
    this.refreshTokenExpiresIn = this.configService.getOrThrow<number>(
      'REFRESH_TOKEN_EXPIRES_IN',
    );
  }

  async login({
    credentialMethod,
    email,
    password,
    idToken,
  }: InfoteamIdpCredential & PasswordCredential): Promise<TokenResDto> {
    let user: typeof schema.users.$inferSelect | undefined;
    if (credentialMethod === 'infoteamIdp') {
      const idpUser = await this.infoteamIdpService
        .validateIdToken(idToken)
        .then((value) => {
          if (!value) {
            throw new UnauthorizedException('Invalid ID token');
          }
          return value;
        });
      user = await this.authRepository.findUserByEmail(idpUser.email);
      if (!user) {
        user = await this.authRepository.createUserWithIdp({
          email: idpUser.email,
          idpUuid: idpUser.uuid,
        });
      }
    } else if (credentialMethod === 'password') {
      user = await this.authRepository.findUserByEmail(email);
      if (
        !user ||
        !user.password ||
        !bcrypt.compareSync(password, user.password)
      ) {
        throw new UnauthorizedException('Invalid email or password');
      }
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const accessToken = this.jwtService.sign({
      sub: user.uuid,
    });
    const refreshToken = this.generateOpaqueToken();
    await this.authRepository.createRefreshToken({
      userUuid: user.uuid,
      token: refreshToken,
      expiresAt: new Date(Date.now() + this.refreshTokenExpiresIn * 1000),
    });
    return {
      accessToken,
      accessTokenExpiresIn: this.accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn: this.refreshTokenExpiresIn,
    };
  }

  async signup({ email, password }: SignupReqDto): Promise<void> {
    await this.authRepository
      .createUserWithPassword({
        email,
        password: bcrypt.hashSync(password, 10),
      })
      .catch(() => {
        throw new ConflictException();
      });
  }

  async refresh({ refreshToken }: RefreshReqDto): Promise<TokenResDto> {
    const previousRefreshToken =
      await this.authRepository.findRefreshToken(refreshToken);
    if (!previousRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.authRepository.deleteRefreshTokenByToken(refreshToken);
    const user = await this.authRepository.findUserByUuid(
      previousRefreshToken.userUuid,
    );
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const accessToken = this.jwtService.sign({
      sub: user.uuid,
    });
    const newRefreshToken = this.generateOpaqueToken();
    await this.authRepository.createRefreshToken({
      userUuid: user.uuid,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + this.refreshTokenExpiresIn * 1000),
    });
    return {
      accessToken,
      accessTokenExpiresIn: this.accessTokenExpiresIn,
      refreshToken: newRefreshToken,
      refreshTokenExpiresIn: this.refreshTokenExpiresIn,
    };
  }

  async logout({ refreshToken }: LogoutReqDto): Promise<void> {
    await this.authRepository.deleteRefreshToken(refreshToken);
  }

  async getUserByUuid(
    userUuid: string,
  ): Promise<typeof schema.users.$inferSelect | undefined> {
    return this.authRepository.findUserByUuid(userUuid);
  }
  /**
   * generate opaque token that does not have any meaning
   * @returns opaque token
   */
  private generateOpaqueToken(): string {
    return crypto.randomBytes(32).toString('base64url');
  }
}
