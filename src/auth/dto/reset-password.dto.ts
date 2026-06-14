import { IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsString()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}