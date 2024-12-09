import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({ description: 'Описание адреса', example: 'Страна, Город' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Имя адреса', example: 'Улица, дом 12' })
  @IsNotEmpty()
  @IsString()
  name: string;
}