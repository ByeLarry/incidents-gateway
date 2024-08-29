import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CategoryDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Category ID' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Category name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 20)
  @ApiProperty({ description: 'Category color' })
  color: string;
}
