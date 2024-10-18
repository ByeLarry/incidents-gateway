import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  readonly surname: string;
}
