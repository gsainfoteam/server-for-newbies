import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupReqDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
