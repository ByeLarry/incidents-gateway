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
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  @ApiProperty({ description: 'Mark coordinates' })
  coordinates: [number, number];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Mark type' })
  type: string;
}
