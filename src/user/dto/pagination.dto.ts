import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';
import { Transform, Type } from 'class-transformer';

export class UsersPaginationDto {
  
  @ApiProperty({
    description: 'Список пользователей, полученных на текущей странице.',
    type: [UserDto],
    example: [
      {
        id: '1234',
        email: 'user@example.com',
        name: 'John',
        surname: 'Doe',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users: UserDto[];

  @ApiProperty({
    description: 'Общее количество пользователей.',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  total: number;

  @ApiProperty({
    description: 'Номер текущей страницы.',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  page: number;

  @ApiProperty({
    description: 'Количество пользователей на странице.',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  limit: number;
}
