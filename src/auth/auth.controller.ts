import {
  Body,
  Controller,
  Delete,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenResDto } from './dto/res/tokenRes.dto';
import { LoginReqDto } from './dto/req/loginReq.dto';
import { PasswordCredential } from './types/passwordCredential.type';
import { InfoteamIdpCredential } from './types/infoteamIdpCredential.type';
import { SignupReqDto } from './dto/req/signupReq.dto';
import { RefreshReqDto } from './dto/req/refreshReq.dto';
import { LogoutReqDto } from './dto/req/logoutReq.dto';

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
  @Post('login')
  async login(@Body() body: LoginReqDto): Promise<TokenResDto> {
    return this.authService.login(
      body as PasswordCredential & InfoteamIdpCredential,
    );
  }

  @Post('signup')
  async signup(@Body() body: SignupReqDto): Promise<void> {
    return this.authService.signup(body);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshReqDto): Promise<TokenResDto> {
    return this.authService.refresh(body);
  }

  @Delete('logout')
  async logout(@Body() body: LogoutReqDto): Promise<void> {
    return this.authService.logout(body);
  }
}
