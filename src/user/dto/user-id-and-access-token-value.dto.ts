import { IsNotEmpty, IsString } from 'class-validator';

export class UserIdAndAccessTokenValueDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  accessTokenValue: string;
}
