import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupReqDto {
  @ApiProperty({
    description: 'Email address of the user to sign up',
    example: 'JohnDoe@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password for the user to sign up',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
