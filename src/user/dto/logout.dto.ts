import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'CSRF token for the user session' })
  csrf_token: string;
}
