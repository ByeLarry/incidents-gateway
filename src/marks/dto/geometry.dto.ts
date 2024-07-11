import { ApiProperty } from '@nestjs/swagger';

export class GeometryDto {
  @ApiProperty({ description: 'Mark coordinates' })
  coordinates: [number, number];

  @ApiProperty({ description: 'Mark type' })
  type: string;
}
