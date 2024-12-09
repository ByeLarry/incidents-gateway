import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
