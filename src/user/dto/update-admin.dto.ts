import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty({
    description: 'Уникальный идентификатор администратора',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Имя администратора',
    example: 'Иван',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Фамилия администратора',
    example: 'Иванов',
  })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty({
    description: 'Электронная почта администратора',
    example: 'ivan.ivanov@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Номер телефона администратора в формате России',
    example: '+7 900 000-00-00',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone_number: string;
}
