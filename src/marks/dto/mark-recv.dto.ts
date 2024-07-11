import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class MarkRecvDto {
  @ApiProperty({ description: 'Mark ID' })
  id: number;

  @ApiProperty({ description: 'Mark latitude' })
  lat: number;

  @ApiProperty({ description: 'Mark longitude' })
  lng: number;

  @ApiProperty({ description: 'Mark title' })
  title?: string;

  @ApiProperty({ description: 'Mark description' })
  description?: string;

  @ApiProperty({ type: CategoryDto, description: 'Mark category' })
  category?: CategoryDto;

  @ApiProperty({ description: 'Mark category ID' })
  categoryId?: number;

  @ApiProperty({ description: 'Mark created at' })
  createdAt?: Date;

  @ApiProperty({ description: 'Mark user ID' })
  userId?: string;

  @ApiProperty({ description: 'Mark distance from user' })
  distance?: number;

  @ApiProperty({ description: 'Mark verified' })
  verified?: number;

  @ApiProperty({ description: 'Mark is my verify' })
  isMyVerify?: boolean;
}
