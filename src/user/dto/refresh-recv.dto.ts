import { ApiProperty } from '@nestjs/swagger';

export class RefreshRecvDto {
  @ApiProperty({ description: 'message' })
  message?: string;

  @ApiProperty({ description: 'CSRF token for the user session' })
  csrf_token: string;

  @ApiProperty({ description: 'Session ID for the user' })
  session_id: string;
}
