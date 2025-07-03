import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutReqDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
