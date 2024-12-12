import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenDto {
  @ApiProperty({
    description:
      'Токен доступа, который используется для авторизации в системе.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjM4MjU5MzAwfQ.JC-5gg8_iyYofqDt10VQqkNE1IgJ5vQI6kI8HZ6B9F0',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  value: string;
}
