import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ITokens } from '../../interfaces';
import { UserDto } from './user.dto';
import { IsNotEmpty } from 'class-validator';

export class UserAndTokensDto {
  @ApiProperty({
    description: 'Объект, содержащий информацию о пользователе.',
    type: UserDto,
  })
  @Type(() => UserDto)
  @IsNotEmpty()
  user: UserDto;
  @ApiProperty({
    description: 'Объект, содержащий токены доступа и обновления.',
    type: Object,
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'dGhpcyBpcyBhIHNhbXBsZSB0b2tlbi4uLg==',
    },
  })
  @IsNotEmpty()
  tokens: ITokens;
}
