import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE_TAG, SESSION_ID_COOKIE_NAME } from '../libs/utils';
import { HttpStatusExtends, MsgAuthEnum } from '../libs/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE_TAG) private client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const session_id_from_cookie = this.getSessionId(req, res);
    const csrf_token = this.getCsrfToken(req, res);

    if (
      typeof session_id_from_cookie !== 'string' ||
      typeof csrf_token !== 'string'
    ) {
      return false;
    }
    return await this.auth(session_id_from_cookie, csrf_token, res);
  }

  private getSessionId(req: Request, res: Response): string | undefined {
    const session_id_from_cookie = this.getSessionIdFromCookie(req);
    if (!session_id_from_cookie) {
      this.sessionIdErrorResponse(res);
      return undefined;
    }
    return session_id_from_cookie;
  }

  private getSessionIdFromCookie(req: Request): string | undefined {
    return req.cookies[SESSION_ID_COOKIE_NAME];
  }

  private sessionIdErrorResponse(res: Response): void {
    res
      .status(HttpStatusExtends.UNAUTHORIZED)
      .json({ message: 'Session ID is missing' });
  }

  private getCsrfToken(req: Request, res: Response): string | undefined {
    const csrf_token = this.getCsrfTokenFromBody(req);
    if (!csrf_token) {
      this.csrfErrorResponse(res);
      return undefined;
    }
    return csrf_token;
  }

  private getCsrfTokenFromBody(req: Request): string | undefined {
    return req.body.csrf_token;
  }

  private csrfErrorResponse(res: Response): void {
    res
      .status(HttpStatusExtends.FORBIDDEN)
      .json({ message: 'CSRF token is missing' });
  }

  private async auth(
    session_id_from_cookie: string,
    csrf_token: string,
    res: Response,
  ): Promise<boolean> {
    try {
      const result = await this.sendAuthData(
        session_id_from_cookie,
        csrf_token,
      );
      return this.mappingError(result, res);
    } catch (error) {
      this.internalServerError(res);
      return false;
    }
  }

  private async sendAuthData(
    session_id_from_cookie: string,
    csrf_token: string,
  ): Promise<undefined | string> {
    return await firstValueFrom(
      this.client.send<undefined | string>(MsgAuthEnum.AUTH, {
        session_id_from_cookie,
        csrf_token,
      }),
    );
  }

  private mappingError(error: string, res: Response): boolean {
    switch (error) {
      case HttpStatusExtends.NOT_FOUND.toString():
        res
          .status(HttpStatusExtends.NOT_FOUND)
          .json({ message: 'User not found' });
        return false;
      case HttpStatusExtends.FORBIDDEN.toString():
        res
          .status(HttpStatusExtends.FORBIDDEN)
          .json({ message: 'CSRF token is missing' });
        return false;
      case HttpStatusExtends.UNAUTHORIZED.toString():
        res
          .status(HttpStatusExtends.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
        return false;
      case HttpStatusExtends.SESSION_EXPIRED.toString():
        res
          .status(HttpStatusExtends.SESSION_EXPIRED)
          .json({ message: 'Session expired' });
        return false;
      case HttpStatusExtends.INTERNAL_SERVER_ERROR.toString():
        res
          .status(HttpStatusExtends.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
        return false;
      default:
        return true;
    }
  }

  private internalServerError(res: Response): void {
    res
      .status(HttpStatusExtends.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
}
