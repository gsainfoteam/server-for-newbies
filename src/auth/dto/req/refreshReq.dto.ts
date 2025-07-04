import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshReqDto {
  @ApiProperty({
    description: 'Refresh token to invalidate during logout',
    example: 'randomString',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
