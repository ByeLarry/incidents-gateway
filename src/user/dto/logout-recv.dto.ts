import { ApiProperty } from '@nestjs/swagger';

export class LogoutRecvDto {
  @ApiProperty({ description: 'message' })
  message: string;
}
