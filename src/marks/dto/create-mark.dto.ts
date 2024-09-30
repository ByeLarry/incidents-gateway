import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateMarkDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @ApiProperty({ description: 'Latitude' })
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @ApiProperty({ description: 'Longitude' })
  lng: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({ description: 'Title' })
  title: string;

  @IsString()
  @Length(0, 200)
  @ApiProperty({ description: 'Description' })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Category ID' })
  categoryId: number;
}
