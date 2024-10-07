import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE_TAG } from '../libs/utils';
import { MsgAuthEnum } from '../libs/enums';
import { AccessTokenDto } from '../user/dto';
import { Reflector } from '@nestjs/core';
import { isPublic } from '../decorators';
import { MicroserviceResponseStatus } from '../libs/dto';

/**
 * @deprecated
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE_TAG) private client: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const _isPublic = isPublic(context, this.reflector);
    if (_isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return false;
    }

    const token = this.extractToken(authHeader);
    if (!token) {
      return false;
    }
    return await this.auth(token, res);
  }

  private extractToken(authHeader: string): string | null {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return null;
  }

  private async auth(token: string, res: Response): Promise<boolean> {
    try {
      const result = await this.sendAuthData(token);
      return this.mappingError(result, res);
    } catch (error) {
      this.internalServerError(res);
      return false;
    }
  }

  private async sendAuthData(
    token: string,
  ): Promise<MicroserviceResponseStatus> {
    const data: AccessTokenDto = {
      value: token,
    };
    const val = await firstValueFrom(
      this.client.send<MicroserviceResponseStatus>(MsgAuthEnum.AUTH, data),
    );
    return val;
  }

  private mappingError(
    error: MicroserviceResponseStatus,
    res: Response,
  ): boolean {
    switch (error.status) {
      case HttpStatus.NOT_FOUND:
        res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
        return false;
      case HttpStatus.FORBIDDEN:
        res.status(HttpStatus.FORBIDDEN).json({ message: 'Forbidden' });
        return false;
      case HttpStatus.UNAUTHORIZED:
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        return false;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
        return false;
      default:
        return true;
    }
  }

  private internalServerError(res: Response): void {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
}
