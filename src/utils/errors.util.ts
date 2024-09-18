import { HttpException } from '@nestjs/common';
import { HttpStatusExtends } from './extendsHttpStatus.enum';

export function errorSwitch(message: string) {
  switch (message) {
    case HttpStatusExtends.NOT_FOUND.toString():
      throw new HttpException('Not found', HttpStatusExtends.NOT_FOUND);
    case HttpStatusExtends.CONFLICT.toString():
      throw new HttpException('Conflict', HttpStatusExtends.CONFLICT);
    case HttpStatusExtends.FORBIDDEN.toString():
      throw new HttpException('Forbidden', HttpStatusExtends.FORBIDDEN);
    case HttpStatusExtends.SESSION_EXPIRED.toString():
      throw new HttpException(
        'Session expired',
        HttpStatusExtends.SESSION_EXPIRED,
      );
    case HttpStatusExtends.UNAUTHORIZED.toString():
      throw new HttpException('Unauthorized', HttpStatusExtends.UNAUTHORIZED);
    case HttpStatusExtends.INTERNAL_SERVER_ERROR.toString():
      throw new HttpException(
        'Internal server error',
        HttpStatusExtends.INTERNAL_SERVER_ERROR,
      );
    case HttpStatusExtends.BAD_REQUEST.toString():
      throw new HttpException('Bad request', HttpStatusExtends.BAD_REQUEST);
    case HttpStatusExtends.UNPROCESSABLE_ENTITY.toString():
      throw new HttpException(
        'Unprocessable entity',
        HttpStatusExtends.UNPROCESSABLE_ENTITY,
      );
    case HttpStatusExtends.TOO_MANY_REQUESTS.toString():
      throw new HttpException(
        'Too many requests',
        HttpStatusExtends.TOO_MANY_REQUESTS,
      );
  }
}
