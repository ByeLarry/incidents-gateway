import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ description: "User's first name" })
  readonly name: string;

  @ApiProperty({ description: "User's password" })
  readonly password: string;

  @ApiProperty({ description: "User's email address" })
  readonly email: string;

  @ApiProperty({ description: "User's last name" })
  readonly surname: string;
}
