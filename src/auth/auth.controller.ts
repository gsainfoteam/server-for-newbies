import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOAuth2, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenResDto } from './dto/res/tokenRes.dto';
import { LoginReqDto } from './dto/req/loginReq.dto';
import { PasswordCredential } from './types/passwordCredential.type';
import { InfoteamIdpCredential } from './types/infoteamIdpCredential.type';
import { SignupReqDto } from './dto/req/signupReq.dto';
import { RefreshReqDto } from './dto/req/refreshReq.dto';
import { LogoutReqDto } from './dto/req/logoutReq.dto';
import { IdTokenReplaceGuard } from './guards/IdTokenReplace.guard';

@ApiTags('auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login',
    description:
      'Authenticate a user and return an access token and refresh token. \n If the user login with password, the user must sign up first. \n If the user login with an infoteam IdP, the user does not need to sign up first.',
  })
  @ApiOAuth2(['openid', 'profile', 'email'], 'idp:idToken')
  @UseGuards(IdTokenReplaceGuard)
  @Post('login')
  async login(@Body() body: LoginReqDto): Promise<TokenResDto> {
    return this.authService.login(
      body as PasswordCredential & InfoteamIdpCredential,
    );
  }

  @ApiOperation({
    summary: 'Sign up',
    description:
      'Create a new user account. \n This endpoint is only for users who want to login with password. \n If the user wants to login with an infoteam IdP, the user does not need to sign up first.',
  })
  @Post('signup')
  async signup(@Body() body: SignupReqDto): Promise<void> {
    return this.authService.signup(body);
  }

  @ApiOperation({
    summary: 'Refresh token',
    description:
      'Refresh the access token using the refresh token. \n The refresh token must be valid and not expired.',
  })
  @Post('refresh')
  async refresh(@Body() body: RefreshReqDto): Promise<TokenResDto> {
    return this.authService.refresh(body);
  }

  @ApiOperation({
    summary: 'Logout',
    description:
      'Logout the user by deleting the refresh token. \n The access token will still be valid until it expires.',
  })
  @Delete('logout')
  async logout(@Body() body: LogoutReqDto): Promise<void> {
    return this.authService.logout(body);
  }
}
