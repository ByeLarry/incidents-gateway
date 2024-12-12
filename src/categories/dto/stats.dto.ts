import { ApiProperty } from '@nestjs/swagger';
import { CountCategoriesIncidentsDto } from '.';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CategoriesStatsDto {
  @ApiProperty({
    description: 'Общее количество категорий.',
    type: Number,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  total: number;

  @ApiProperty({
    description: 'Список категорий с количеством инцидентов.',
    type: [CountCategoriesIncidentsDto],
    example: [
      { category: 'Авария', incidentsCount: 25 },
      { category: 'Другое', incidentsCount: 15 },
    ],
  })
  @IsNotEmpty()
  @Type(() => CountCategoriesIncidentsDto)
  incidents: CountCategoriesIncidentsDto[];
}
