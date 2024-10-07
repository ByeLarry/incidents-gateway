import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { UserDto } from '../user/dto';

export const CurrentUser = createParamDecorator(
  (key: keyof UserDto, ctx: ExecutionContext): UserDto | Partial<UserDto> => {
    const request = ctx.switchToHttp().getRequest();
    return key ? request.user[key] : request.user;
  },
);
