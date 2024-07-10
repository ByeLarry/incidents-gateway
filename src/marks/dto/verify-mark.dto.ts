import { ApiProperty } from '@nestjs/swagger';

export class VerifyMarkDto {
  @ApiProperty({ description: 'Mark ID' })
  markId: number;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'CSRF Token' })
  csrf_token: string;
}
