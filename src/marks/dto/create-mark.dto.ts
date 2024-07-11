import { ApiProperty } from '@nestjs/swagger';

export class CreateMarkDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'CSRF Token' })
  csrf_token: string;

  @ApiProperty({ description: 'Latitude' })
  lat: number;

  @ApiProperty({ description: 'Longitude' })
  lng: number;

  @ApiProperty({ description: 'Title' })
  title: string;

  @ApiProperty({ description: 'Description' })
  description: string;

  @ApiProperty({ description: 'Category ID' })
  categoryId: number;
}
