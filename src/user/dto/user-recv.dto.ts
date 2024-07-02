import { ApiProperty } from '@nestjs/swagger';

export class UserRecvDto {
  @ApiProperty({ description: "User's first name" })
  name: string;

  @ApiProperty({ description: "User's last name" })
  surname: string;

  @ApiProperty({ description: "User's email address" })
  email: string;

  @ApiProperty({ description: "User's unique identifier" })
  _id: string;

  @ApiProperty({ description: "User's activation status", default: false })
  activated: boolean;

  @ApiProperty({ description: 'CSRF token for the user session' })
  csrf_token: string;

  @ApiProperty({ description: 'Session ID for the user' })
  session_id?: string;
}
