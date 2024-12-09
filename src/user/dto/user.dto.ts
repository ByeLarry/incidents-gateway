import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from '../../libs/enums';
import { AuthProvidersEnum } from '../../libs/enums/auth-providers.enum';
import { Transform } from 'class-transformer';

export class UserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  surname: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 100)
  email: string;

  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: '12345',
    minLength: 0,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  id: string;

  @ApiProperty({
    description: 'Статус активации пользователя',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  activated: boolean;

  @ApiProperty({
    description: 'Роли пользователя в системе',
    example: ['admin', 'user'],
    enum: RolesEnum,
  })
  @IsNotEmpty()
  roles: RolesEnum[];

  @ApiProperty({
    description: 'Поставщик аутентификации пользователя',
    example: 'google',
    enum: AuthProvidersEnum,
  })
  @IsNotEmpty()
  provider: AuthProvidersEnum;

  @ApiProperty({
    description: 'Количество токенов пользователя (необязательное поле)',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  tokensCount?: number;

  @ApiProperty({
    description: 'Номер телефона пользователя (необязательное поле)',
    example: '+7 900 123-45-67',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('RU')
  phone_number?: string;

  @ApiProperty({
    description: 'Дата создания пользователя (необязательное поле)',
    example: '2023-12-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  createdAt?: Date;

  @ApiProperty({
    description: 'Дата последнего обновления пользователя (необязательное поле)',
    example: '2023-12-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  updatedAt?: Date;
}
