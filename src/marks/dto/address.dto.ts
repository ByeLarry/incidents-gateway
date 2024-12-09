import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({ description: 'Более широкий адрес', example: 'Страна, Город' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Адрес', example: 'Улица, дом 12' })
  @IsNotEmpty()
  @IsString()
  name: string;
}