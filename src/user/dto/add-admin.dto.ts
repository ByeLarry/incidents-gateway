import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddAdminDto {
  @ApiProperty({
    description: 'Идентификатор пользователя, которого нужно назначить администратором',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
