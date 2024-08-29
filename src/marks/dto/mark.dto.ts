import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class MarkDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value), { toClassOnly: true })
  userId: string;

  @ApiProperty({ description: 'Mark ID' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  markId: number;

  @ApiProperty({ description: 'Mark latitude' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  lat: number;

  @ApiProperty({ description: 'Mark longitude' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  lng: number;
}
