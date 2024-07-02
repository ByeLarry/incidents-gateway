import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({ description: 'CSRF token for the user session' })
  csrf_token: string;
}
