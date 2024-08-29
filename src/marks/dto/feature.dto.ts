import { ApiProperty } from '@nestjs/swagger';
import { PropertiesDto } from './properties.dto';
import { GeometryDto } from './geometry.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FeatureDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Mark ID' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Mark type' })
  type: string;

  @ValidateNested()
  @Type(() => GeometryDto)
  @ApiProperty({ type: GeometryDto, description: 'Mark coordinates' })
  geometry: GeometryDto;

  @ValidateNested()
  @Type(() => PropertiesDto)
  @ApiProperty({ type: PropertiesDto, description: 'Mark properties' })
  properties: PropertiesDto;
}
