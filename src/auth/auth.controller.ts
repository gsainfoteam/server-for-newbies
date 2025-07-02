import { Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(): Promise<void> {}

  @Post('signup')
  async signup(): Promise<void> {}

  @Post('refresh')
  async refresh(): Promise<void> {}

  @Delete('logout')
  async logout(): Promise<void> {}
}
