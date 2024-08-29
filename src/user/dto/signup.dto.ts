import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({ description: "User's first name" })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  @ApiProperty({ description: "User's password" })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @IsEmail()
  @ApiProperty({ description: "User's email address" })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({ description: "User's last name" })
  readonly surname: string;
}
