import { HttpException } from '@nestjs/common';
import { errorSwitch } from '../utils/errors.util';
import { HttpStatusExtends } from '../utils/extendsHttpStatus.enum';

describe('errorSwitch', () => {
  it('should throw HttpException with "Not found" message and NOT_FOUND status', () => {
    expect(() => errorSwitch(HttpStatusExtends.NOT_FOUND.toString())).toThrow(
      new HttpException('Not found', HttpStatusExtends.NOT_FOUND),
    );
  });

  it('should throw HttpException with "Conflict" message and CONFLICT status', () => {
    expect(() => errorSwitch(HttpStatusExtends.CONFLICT.toString())).toThrow(
      new HttpException('Conflict', HttpStatusExtends.CONFLICT),
    );
  });

  it('should throw HttpException with "Forbidden" message and FORBIDDEN status', () => {
    expect(() => errorSwitch(HttpStatusExtends.FORBIDDEN.toString())).toThrow(
      new HttpException('Forbidden', HttpStatusExtends.FORBIDDEN),
    );
  });

  it('should throw HttpException with "Session expired" message and SESSION_EXPIRED status', () => {
    expect(() =>
      errorSwitch(HttpStatusExtends.SESSION_EXPIRED.toString()),
    ).toThrow(
      new HttpException('Session expired', HttpStatusExtends.SESSION_EXPIRED),
    );
  });

  it('should throw HttpException with "Unauthorized" message and UNAUTHORIZED status', () => {
    expect(() =>
      errorSwitch(HttpStatusExtends.UNAUTHORIZED.toString()),
    ).toThrow(
      new HttpException('Unauthorized', HttpStatusExtends.UNAUTHORIZED),
    );
  });

  it('should throw HttpException with "Internal server error" message and INTERNAL_SERVER_ERROR status', () => {
    expect(() =>
      errorSwitch(HttpStatusExtends.INTERNAL_SERVER_ERROR.toString()),
    ).toThrow(
      new HttpException(
        'Internal server error',
        HttpStatusExtends.INTERNAL_SERVER_ERROR,
      ),
    );
  });

  it('should throw HttpException with "Bad request" message and BAD_REQUEST status', () => {
    expect(() => errorSwitch(HttpStatusExtends.BAD_REQUEST.toString())).toThrow(
      new HttpException('Bad request', HttpStatusExtends.BAD_REQUEST),
    );
  });

  it('should throw HttpException with "Unprocessable entity" message and UNPROCESSABLE_ENTITY status', () => {
    expect(() =>
      errorSwitch(HttpStatusExtends.UNPROCESSABLE_ENTITY.toString()),
    ).toThrow(
      new HttpException(
        'Unprocessable entity',
        HttpStatusExtends.UNPROCESSABLE_ENTITY,
      ),
    );
  });

  it('should throw HttpException with "Too many requests" message and TOO_MANY_REQUESTS status', () => {
    expect(() =>
      errorSwitch(HttpStatusExtends.TOO_MANY_REQUESTS.toString()),
    ).toThrow(
      new HttpException(
        'Too many requests',
        HttpStatusExtends.TOO_MANY_REQUESTS,
      ),
    );
  });

  it('should not throw an exception for unknown status', () => {
    expect(() => errorSwitch('unknown')).not.toThrow();
  });
});
