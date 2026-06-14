import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitDto, VisitStatus } from './create-visit.dto';
import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateVisitDto extends PartialType(CreateVisitDto) {
  @IsOptional()
  @IsDateString()
  checkinAt?: string;

  @IsOptional()
  @IsNumber()
  checkinLat?: number;

  @IsOptional()
  @IsNumber()
  checkinLng?: number;

  @IsOptional()
  @IsDateString()
  checkoutAt?: string;

  @IsOptional()
  @IsNumber()
  checkoutLat?: number;

  @IsOptional()
  @IsNumber()
  checkoutLng?: number;

  @IsOptional()
  @IsNumber()
  durationMin?: number;

  @IsOptional()
  @IsNumber()
  score?: number;
}
