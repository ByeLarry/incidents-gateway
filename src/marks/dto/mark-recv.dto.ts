import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class MarkRecvDto {
  @ApiProperty({ description: 'Mark ID' })
  @IsInt()
  @IsNotEmpty()
  id: number;

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

  @ApiProperty({ description: 'Mark title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Mark description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Mark category ID' })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({ description: 'Mark created at' })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({ description: 'Mark user ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Mark distance from user' })
  @IsOptional()
  @IsNumber()
  distance?: number;

  @ApiProperty({ description: 'Mark verified' })
  @IsOptional()
  @IsInt()
  @Min(0)
  verified?: number;

  @ApiProperty({ description: 'Mark is my verify' })
  @IsOptional()
  @IsBoolean()
  isMyVerify?: boolean;

  @ApiProperty({ description: 'Mark color' })
  @IsOptional()
  @IsString()
  color?: string;
}
