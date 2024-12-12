import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    description: 'Уникальный идентификатор категории',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  id: number;

  @ApiProperty({
    description: 'Название категории',
    example: 'Technology',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Цвет категории в формате HEX',
    example: 'blue',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: 'Дата создания категории',
    example: '2023-12-01T10:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления категории',
    example: '2023-12-10T15:30:00Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
