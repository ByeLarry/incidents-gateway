import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class PropertiesDto {
  @ApiProperty({ description: 'Mark title' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @ApiProperty({ description: 'Mark description' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  description?: string;

  @ApiProperty({ description: 'Mark category ID' })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ description: 'Mark created at' })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({ description: 'Mark user ID' })
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  userId: string;

  @ApiProperty({ description: 'Mark distance from user' })
  @IsNumber()
  @IsOptional()
  distance?: number;

  @ApiProperty({ description: 'Mark color' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  color?: string;
}
