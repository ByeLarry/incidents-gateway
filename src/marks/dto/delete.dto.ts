import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class DeleteMarkByUserDto {
  @ApiPropertyOptional({
    description: 'Идентификатор метки для удаления',
    example: '12345',
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  markId: number;

  @ApiPropertyOptional({
    description: 'Идентификатор пользователя, связанного с меткой',
    example: '67890',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
