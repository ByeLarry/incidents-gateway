import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({
    description: 'Имя администратора для входа в систему',
    example: 'adminUser',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3)
  name: string;

  @ApiProperty({
    description: 'Пароль администратора',
    example: 'securePassword123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  @ApiProperty({
    description: 'Информация о пользовательском агенте, которая может быть предоставлена (не обязательная)',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    required: false,
  })
  @Transform(({ value }) => value ?? '')  
  userAgent?: string;
}
