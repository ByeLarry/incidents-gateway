import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UsersStatsDto {
  @ApiProperty({
    description: 'Общее количество пользователей.',
    example: 1500,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  total: number;

  @ApiProperty({
    description: 'Количество пользователей-администраторов.',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  admins: number;

  @ApiProperty({
    description: 'Количество активных сессий пользователей.',
    example: 500,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  activeSessions: number;

  @ApiProperty({
    description: 'Количество заблокированных пользователей.',
    example: 30,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  blocked: number;

  @ApiProperty({
    description: 'Количество активированных пользователей.',
    example: 1200,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  activated: number;
}
