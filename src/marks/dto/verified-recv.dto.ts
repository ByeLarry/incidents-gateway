import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerifiedRecvDto {
  @ApiProperty({
    description: 'Количество подтверждений метки',
    example: 42,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  verified: number;
}
