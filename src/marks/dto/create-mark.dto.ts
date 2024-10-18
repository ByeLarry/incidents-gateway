import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { AddressDto } from './';

export class CreateMarkDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  lng: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsString()
  @Length(0, 200)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @Type(() => AddressDto)
  address?: AddressDto;
}
