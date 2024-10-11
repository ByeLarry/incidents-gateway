import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AdminLoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  @Transform(({ value }) => value ?? '')  
  userAgent?: string;
}
