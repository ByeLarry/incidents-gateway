import { HttpException, HttpStatus } from '@nestjs/common';
import { MicroserviceResponseStatus } from '../dto/microservice-response-status.dto';

export function errorSwitch(message: MicroserviceResponseStatus) {
  switch (message.status as HttpStatus) {
    case HttpStatus.NOT_FOUND:
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    case HttpStatus.CONFLICT:
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    case HttpStatus.FORBIDDEN:
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    case HttpStatus.UNAUTHORIZED:
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    case HttpStatus.INTERNAL_SERVER_ERROR:
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    case HttpStatus.BAD_REQUEST:
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    case HttpStatus.UNPROCESSABLE_ENTITY:
      throw new HttpException(
        'Unprocessable entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    case HttpStatus.TOO_MANY_REQUESTS:
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
  }
}
