import { ApiProperty } from '@nestjs/swagger';

export class VerifiedRecvDto {
  @ApiProperty({ description: 'Number of verifies' })
  verified: number;
}
