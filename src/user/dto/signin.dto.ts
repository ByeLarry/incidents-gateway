import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({ description: "User's email address" })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  @ApiProperty({ description: "User's password" })
  readonly password: string;
}
