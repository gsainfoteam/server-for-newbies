import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutReqDto {
  @ApiProperty({
    description: 'Refresh token to invalidate during logout',
    example: 'randomString',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
