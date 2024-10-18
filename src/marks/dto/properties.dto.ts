import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class PropertiesDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsString()
  @IsOptional()
  @Length(0, 200)
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  userId: string;

  @IsNumber()
  @IsOptional()
  distance?: number;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  color?: string;
}
