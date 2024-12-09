import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Название категории. Это обязательное поле.',
    example: 'Еда',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'Цвет категории (необязательное поле). Может быть использовано для визуального выделения категории.',
    example: 'blue',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;
}
