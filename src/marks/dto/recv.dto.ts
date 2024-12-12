import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class MarkRecvDto {
  @ApiProperty({
    description: 'Идентификатор метки',
    type: Number,
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  id: number;

  @ApiProperty({
    description: 'Широта местоположения метки',
    type: Number,
    example: 55.7558,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  lat: number;

  @ApiProperty({
    description: 'Долгота местоположения метки',
    type: Number,
    example: 37.6173,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  lng: number;

  @ApiProperty({
    description: 'Заголовок метки',
    type: String,
    example: 'Авария на дороге',
    required: false,
  })
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Описание метки',
    type: String,
    example: 'На дороге произошла авария с несколькими пострадавшими.',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Дата создания метки',
    type: Date,
    example: '2024-12-12T10:00:00Z',
    required: false,
  })
  @IsDate()
  createdAt?: Date;

  @ApiProperty({
    description: 'Идентификатор пользователя, создавшего метку',
    type: String,
    example: 'user123',
    required: false,
  })
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Расстояние от текущей позиции',
    type: Number,
    example: 200,
    required: false,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  distance?: number;

  @ApiProperty({
    description: 'Статус верификации метки',
    type: Number,
    example: 1,
    required: false,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  verified?: number;

  @ApiProperty({
    description: 'Статус личной верификации метки',
    type: Boolean,
    example: true,
    required: false,
  })
  @IsBoolean()
  isMyVerify?: boolean;

  @ApiProperty({
    description: 'Идентификатор категории метки',
    type: Number,
    example: 5,
    required: false,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  categoryId?: number;

  @ApiProperty({
    description: 'Цвет метки',
    type: String,
    example: 'green',
    required: false,
  })
  @IsString()
  color?: string;

  @ApiProperty({
    description: 'Описание адреса метки',
    type: String,
    example: 'Улица Ленина, дом 10',
    required: false,
  })
  @IsString()
  addressDescription?: string;

  @ApiProperty({
    description: 'Название адреса метки',
    type: String,
    example: 'Местоположение аварии',
    required: false,
  })
  @IsString()
  addressName?: string;
}
