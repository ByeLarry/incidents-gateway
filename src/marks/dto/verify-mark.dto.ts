import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyMarkDto {
  @IsNumber()
  @IsNotEmpty()
  markId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
