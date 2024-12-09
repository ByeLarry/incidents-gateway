import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './';

export class CreateMarkDto {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя, создающего метку',
    example: 'f7f4b6c9-95be-45b9-bc24-1324f9dbecfd',
  })
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  userId: string;

  @ApiProperty({
    description: 'Широта места метки',
    example: 52.52,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  lat: number;

  @ApiProperty({
    description: 'Долгота места метки',
    example: 13.405,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  lng: number;

  @ApiProperty({
    description: 'Название метки',
    example: 'Моя первая метка',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @ApiProperty({
    description: 'Описание метки',
    example:
      'Это описание моей метки, которое может быть очень длинным, но не обязательным.',
    required: false,
  })
  @IsString()
  @Length(0, 200)
  description: string;

  @ApiProperty({
    description: 'Идентификатор категории метки',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'Адрес, связанный с меткой',
    type: AddressDto,
    required: false,
  })
  @Type(() => AddressDto)
  address?: AddressDto;
}
