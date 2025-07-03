import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import {
  CredentialMethod,
  CredentialMethodList,
} from 'src/auth/types/credentialMethod.type';

export class LoginReqDto {
  @ApiProperty({
    description: 'credential method to use for login',
    example: 'password',
    enum: CredentialMethodList,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(CredentialMethodList)
  credentialMethod: CredentialMethod;

  @ApiPropertyOptional({
    description: 'email for password login',
    example: 'JohnDoe@gistory.me',
    type: String,
  })
  @ValidateIf((o: LoginReqDto) => o.credentialMethod === 'password')
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'password for password login',
    example: 'password123',
  })
  @ValidateIf((o: LoginReqDto) => o.credentialMethod === 'password')
  @IsNotEmpty()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'ID token for Infoteam IDP login',
    example: 'eyJraWQiOiJrZXkiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...',
  })
  @ValidateIf((o: LoginReqDto) => o.credentialMethod === 'infoteamIdp')
  @IsOptional()
  @IsJWT()
  idToken?: string;
}
