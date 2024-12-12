import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class GeometryDto {
  @ApiProperty({
    description: 'Массив с двумя числами, представляющими координаты (широта, долгота).',
    example: [40.7128, -74.0060],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  coordinates: [number, number];

  @ApiProperty({
    description: 'Тип геометрии (например, "Point").',
    example: 'Point',
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}
