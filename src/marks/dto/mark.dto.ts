import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class MarkDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  markId: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  lng: number;
}
