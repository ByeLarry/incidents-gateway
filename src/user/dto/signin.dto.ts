import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'Электронная почта пользователя для входа в систему',
    example: 'user@example.com',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Length(3, 100)
  readonly email: string;

  @ApiProperty({
    description: 'Пароль пользователя для входа в систему',
    example: 'password123',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  readonly password: string;

  @ApiProperty({
    description: 'Токен reCAPTCHA для подтверждения, что запрос сделан реальным пользователем',
    example: '03AGdBq24...',
  })
  @IsString()
  @IsNotEmpty()
  recaptchaToken: string;
}
