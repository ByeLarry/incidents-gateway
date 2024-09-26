import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({ description: "User's first name" })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({ description: "User's last name" })
  surname: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 100)
  @ApiProperty({ description: "User's email address" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  @ApiProperty({ description: "User's unique identifier" })
  _id: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: "User's activation status", default: false })
  activated: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'CSRF token for the user session' })
  csrf_token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Session ID for the user' })
  session_id?: string;
}
