import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CoordsDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @ApiProperty({ description: 'Latitude' })
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @ApiProperty({ description: 'Longitude' })
  lng: number;
}
