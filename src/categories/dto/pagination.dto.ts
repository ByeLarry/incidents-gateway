import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class CategoriesPaginationDto {
  @ApiProperty({
    description: 'Общее количество категорий',
    example: 100,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Текущая страница пагинации',
    example: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Количество категорий на странице',
    example: 10,
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'Список категорий на текущей странице',
    type: [CategoryDto],
  })
  categories: CategoryDto[];
}
