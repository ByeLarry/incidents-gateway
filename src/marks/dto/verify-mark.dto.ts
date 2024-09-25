import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyMarkDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Mark ID' })
  markId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'CSRF Token' })
  csrf_token: string;
}
