import { HttpException } from '@nestjs/common';
import { HttpStatusExtends } from './extendsHttpStatus.enum';
import { MicroserviceResponseStatus } from '../dto/microserviceResponseStatus.dto';

export function errorSwitch(message: MicroserviceResponseStatus) {
  switch (message.status as HttpStatusExtends) {
    case HttpStatusExtends.NOT_FOUND:
      throw new HttpException('Not found', HttpStatusExtends.NOT_FOUND);
    case HttpStatusExtends.CONFLICT:
      throw new HttpException('Conflict', HttpStatusExtends.CONFLICT);
    case HttpStatusExtends.FORBIDDEN:
      throw new HttpException('Forbidden', HttpStatusExtends.FORBIDDEN);
    case HttpStatusExtends.SESSION_EXPIRED:
      throw new HttpException(
        'Session expired',
        HttpStatusExtends.SESSION_EXPIRED,
      );
    case HttpStatusExtends.UNAUTHORIZED:
      throw new HttpException('Unauthorized', HttpStatusExtends.UNAUTHORIZED);
    case HttpStatusExtends.INTERNAL_SERVER_ERROR:
      throw new HttpException(
        'Internal server error',
        HttpStatusExtends.INTERNAL_SERVER_ERROR,
      );
    case HttpStatusExtends.BAD_REQUEST:
      throw new HttpException('Bad request', HttpStatusExtends.BAD_REQUEST);
    case HttpStatusExtends.UNPROCESSABLE_ENTITY:
      throw new HttpException(
        'Unprocessable entity',
        HttpStatusExtends.UNPROCESSABLE_ENTITY,
      );
    case HttpStatusExtends.TOO_MANY_REQUESTS:
      throw new HttpException(
        'Too many requests',
        HttpStatusExtends.TOO_MANY_REQUESTS,
      );
  }
}
