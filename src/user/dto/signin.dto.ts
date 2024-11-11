import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Length(3, 100)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  recaptchaToken: string;
}
