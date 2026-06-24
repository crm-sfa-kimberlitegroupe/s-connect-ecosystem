import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsDateString } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  SUP = 'SUP',
  REP = 'REP'
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  matricule: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @IsOptional()
  territoryId?: string;

  @IsOptional()
  managerId?: string;

  // À ajouter dans la classe RegisterDto
  @IsOptional()
  @IsString()
  photoUrl?: string;

}