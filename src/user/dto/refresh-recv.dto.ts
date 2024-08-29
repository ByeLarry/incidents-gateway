import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RefreshRecvDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'message' })
  message?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Session ID for the user' })
  session_id: string;
}
