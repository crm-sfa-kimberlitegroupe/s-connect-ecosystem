import { IsString, MinLength } from 'class-validator';

export class TwoFactorVerifyDto {
  @IsString()
  code: string;
}