import { ApiProperty } from '@nestjs/swagger';

export class MarkDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Mark ID' })
  markId: string;
}
