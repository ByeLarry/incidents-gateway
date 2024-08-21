import { Inject, Injectable, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE_TAG } from '../utils/auth.service.provide';
import { HttpStatusExtends } from '../utils/extendsHttpStatus.enum';
import { MsgAuthEnum } from '../utils/msg.auth.enum';

@Injectable()
export class AuthMiddleware {
  constructor(@Inject(AUTH_SERVICE_TAG) private client: ClientProxy) {}
  async use(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    next: () => void,
  ) {
    const session_id_from_cookie = this.getSessionId(req, res);

    const csrf_token = this.getCsrfToken(req, res);

    if (
      typeof session_id_from_cookie === 'string' &&
      typeof csrf_token === 'string'
    )
      await this.auth(session_id_from_cookie, csrf_token, res);

    next();
  }

  private getSessionId(req: Request, res: Response): string | Response {
    const session_id_from_cookie = this.getSessionIdFromCookie(req);
    if (!session_id_from_cookie) {
      return this.sessionIdErrorResponse(res);
    }
    return session_id_from_cookie;
  }

  private getSessionIdFromCookie(req: Request): string | undefined {
    return req.cookies['incidents_session_id'];
  }

  private sessionIdErrorResponse(res: Response): Response {
    return res
      .status(HttpStatusExtends.UNAUTHORIZED)
      .json({ message: 'Session ID is missing' });
  }

  private getCsrfToken(req: Request, res: Response): string | Response {
    const csrf_token = this.getCsrfTokenFromBody(req);
    if (!csrf_token) {
      return this.csrfErrorResponse(res);
    }
    return csrf_token;
  }

  private getCsrfTokenFromBody(req: Request): string | undefined {
    return req.body.csrf_token;
  }

  private csrfErrorResponse(res: Response): Response {
    return res
      .status(HttpStatusExtends.FORBIDDEN)
      .json({ message: 'CSRF token is missing' });
  }

  private async auth(
    session_id_from_cookie: string,
    csrf_token: string,
    res: Response,
  ) {
    try {
      const result = await this.sendAuthData(
        session_id_from_cookie,
        csrf_token,
      );
      this.mappingError(result, res);
    } catch (error) {
      return this.internalServerError(res);
    }
  }

  private async sendAuthData(
    session_id_from_cookie: string,
    csrf_token: string,
  ): Promise<undefined | string> {
    return await firstValueFrom(
      this.client.send<undefined | string>(
        { cmd: MsgAuthEnum.AUTH },
        { session_id_from_cookie, csrf_token },
      ),
    );
  }

  private mappingError(error: string, res: Response): Response | undefined {
    switch (error) {
      case HttpStatusExtends.NOT_FOUND.toString():
        return res
          .status(HttpStatusExtends.NOT_FOUND)
          .json({ message: 'User not found' });
      case HttpStatusExtends.FORBIDDEN.toString():
        return res
          .status(HttpStatusExtends.FORBIDDEN)
          .json({ message: 'CSRF token is missing' });
      case HttpStatusExtends.UNAUTHORIZED.toString():
        return res
          .status(HttpStatusExtends.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      case HttpStatusExtends.SESSION_EXPIRED.toString():
        return res
          .status(HttpStatusExtends.SESSION_EXPIRED)
          .json({ message: 'Session expired' });
      case HttpStatusExtends.INTERNAL_SERVER_ERROR.toString():
        return res
          .status(HttpStatusExtends.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
      default:
        return;
    }
  }

  private internalServerError(res: Response): Response {
    return res
      .status(HttpStatusExtends.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
}
