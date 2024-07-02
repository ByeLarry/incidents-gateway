import { ApiProperty } from '@nestjs/swagger';

export class RefreshSendDto {
  @ApiProperty({ description: 'message' })
  message: string;
}
