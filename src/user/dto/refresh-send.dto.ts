import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshSendDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'message' })
  message: string;
}
