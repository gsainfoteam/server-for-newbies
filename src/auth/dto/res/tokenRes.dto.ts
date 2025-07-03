import { ApiProperty } from '@nestjs/swagger';

export class TokenResDto {
  @ApiProperty({ description: 'The access token for the user' })
  accessToken: string;

  @ApiProperty({
    description: 'The duration in seconds for which the access token is valid',
  })
  accessTokenExpiresIn: number;

  @ApiProperty({ description: 'The refresh token for the user' })
  refreshToken: string;

  @ApiProperty({
    description: 'The duration in seconds for which the refresh token is valid',
  })
  refreshTokenExpiresIn: number;
}
