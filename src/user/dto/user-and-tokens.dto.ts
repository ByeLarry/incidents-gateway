import { Type } from 'class-transformer';
import { ITokens } from '../../interfaces';
import { UserDto } from './user.dto';
import { IsNotEmpty } from 'class-validator';

export class UserAndTokensDto {
  @Type(() => UserDto)
  @IsNotEmpty()
  user: UserDto;

  @IsNotEmpty()
  tokens: ITokens;
}
