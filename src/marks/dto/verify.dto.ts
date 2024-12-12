import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyMarkDto {
  @ApiProperty({
    description: 'Уникальный идентификатор метки, которую необходимо проверить',
    example: 123,
  })
  @IsNumber()
  @IsNotEmpty()
  markId: number;

  @ApiProperty({
    description: 'Уникальный идентификатор пользователя, который выполняет проверку',
    example: 'f7f4b6c9-95be-45b9-bc24-1324f9dbecfd',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
