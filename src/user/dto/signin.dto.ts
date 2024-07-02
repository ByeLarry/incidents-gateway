import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ description: "User's email address" })
  readonly email: string;

  @ApiProperty({ description: "User's password" })
  readonly password: string;
}
