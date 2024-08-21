import { ApiProperty } from '@nestjs/swagger';

export class CoordsDto {
  @ApiProperty({ description: 'Latitude' })
  lat: number;

  @ApiProperty({ description: 'Longitude' })
  lng: number;
}
