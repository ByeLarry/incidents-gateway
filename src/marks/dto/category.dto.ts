import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ description: 'Category ID' })
  id: number;

  @ApiProperty({ description: 'Category name' })
  name: string;

  @ApiProperty({ description: 'Category color' })
  color: string;
}
