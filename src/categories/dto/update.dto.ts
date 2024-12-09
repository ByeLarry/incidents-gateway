import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Уникальный идентификатор категории. Это обязательное поле.',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  id: number;

  @ApiProperty({
    description: 'Новое название категории. Это обязательное поле.',
    example: 'Напитки',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Новый цвет категории (необязательное поле). Может быть использовано для визуального выделения.',
    example: 'green',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;
}
