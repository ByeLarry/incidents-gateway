import { PropertiesDto } from './properties.dto';
import { GeometryDto } from './geometry.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FeatureDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @ValidateNested()
  @Type(() => GeometryDto)
  geometry: GeometryDto;

  @ValidateNested()
  @Type(() => PropertiesDto)
  properties: PropertiesDto;
}
