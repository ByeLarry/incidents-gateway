import { ApiProperty } from '@nestjs/swagger';
import { PropertiesDto } from './properties.dto';
import { GeometryDto } from './geometry.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FeatureDto {
  @ApiProperty({
    description: 'Идентификатор объекта.',
    example: 'abc123',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Тип объекта.',
    example: 'Feature',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Геометрия объекта, описывающая его расположение.',
    type: GeometryDto,
  })
  @ValidateNested()
  @Type(() => GeometryDto)
  geometry: GeometryDto;

  @ApiProperty({
    description: 'Свойства объекта, описывающие его характеристики.',
    type: PropertiesDto,
  })
  @ValidateNested()
  @Type(() => PropertiesDto)
  properties: PropertiesDto;
}
