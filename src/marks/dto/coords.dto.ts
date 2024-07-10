import { ApiProperty } from '@nestjs/swagger';

export class CoordsDto {
  @ApiProperty({ description: 'User latitude' })
  lat: number;

  @ApiProperty({ description: 'User longitude' })
  lng: number;
}
