import { ROLES_KEY } from '../decorators';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MsgAuthEnum, RolesEnum } from '../libs/enums';
import { AUTH_SERVICE_TAG, throwErrorIfExists } from '../libs/utils';
import { ClientProxy } from '@nestjs/microservices';
import { AccessTokenDto, UserDto } from '../user/dto';
import { firstValueFrom } from 'rxjs';
import { MicroserviceResponseStatus } from '../libs/dto';
import { handleTimeoutAndErrors } from '../libs/helpers';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(AUTH_SERVICE_TAG) private client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const accessTokenValue = context.switchToHttp().getRequest().headers[
      'authorization'
    ];

    if (!accessTokenValue) {
      return false;
    }

    const requestDto: AccessTokenDto = {
      value: accessTokenValue.replace('Bearer ', ''),
    };

    const user = await firstValueFrom(
      this.client.send<UserDto | MicroserviceResponseStatus>(
        MsgAuthEnum.USER_ROLES,
        requestDto,
      ).pipe(handleTimeoutAndErrors()),
    );
    throwErrorIfExists(user as MicroserviceResponseStatus);
    if (!user) {
      return false;
    }
    return requiredRoles.some((role) => (user as UserDto).roles.includes(role));
  }
}
