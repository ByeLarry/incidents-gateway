import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  readonly name: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  readonly password: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  readonly surname: string;

  @ApiProperty({
    description: 'Токен reCAPTCHA для проверки',
    example: '03AGdBq24...',
  })
  @IsString()
  @IsNotEmpty()
  recaptchaToken: string;
}
