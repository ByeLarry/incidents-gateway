import { ApiProperty } from '@nestjs/swagger';
import { PropertiesDto } from './properties.dto';
import { GeometryDto } from './geometry.dto';

export class FeatureDto {
  @ApiProperty({ description: 'Mark ID' })
  id: string;

  @ApiProperty({ description: 'Mark type' })
  type: string;

  @ApiProperty({ type: GeometryDto, description: 'Mark coordinates' })
  geometry: GeometryDto;

  @ApiProperty({ type: PropertiesDto, description: 'Mark properties' })
  properties: PropertiesDto;
}
