import { ApiProperty } from '@nestjs/swagger';

export class PropertiesDto {
  @ApiProperty({ description: 'Mark title' })
  title: string;

  @ApiProperty({ description: 'Mark description' })
  description: string;

  @ApiProperty({ description: 'Mark category ID' })
  categoryId: number;

  @ApiProperty({ description: 'Mark created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Mark user ID' })
  userId: string;

  @ApiProperty({ description: 'Mark distance from user' })
  distance: number;
}
