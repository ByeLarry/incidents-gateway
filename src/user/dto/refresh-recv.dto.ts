import { ApiProperty } from '@nestjs/swagger';

export class RefreshRecvDto {
  @ApiProperty({ description: 'message' })
  message?: string;

  @ApiProperty({ description: 'Session ID for the user' })
  session_id: string;
}
