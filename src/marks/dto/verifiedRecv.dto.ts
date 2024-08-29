import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerifiedRecvDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Number of verifies' })
  verified: number;
}
