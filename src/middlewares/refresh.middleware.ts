import { Inject, Injectable, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { RefreshRecvDto } from '../user/dto/refresh-recv.dto';
import { AUTH_SERVICE_TAG } from '../utils/authServiceProvide.util';
import { DateEnum } from '../utils/date.enum';
import { HttpStatusExtends } from '../utils/extendsHttpStatus.enum';
import { MsgAuthEnum } from '../utils/msg.auth.enum';

@Injectable()
export class RefreshMiddleware {
  constructor(@Inject(AUTH_SERVICE_TAG) private client: ClientProxy) {}
  async use(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    next: () => void,
  ): Promise<void> {
    const session_id_from_cookie = this.getSessionId(req, res);

    if (typeof session_id_from_cookie === 'string')
      await this.refresh(session_id_from_cookie, res);

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

  private async refresh(
    session_id_from_cookie: string,
    res: Response,
  ): Promise<void | Response> {
    try {
      const result: RefreshRecvDto | string = await this.sendRefreshData(
        session_id_from_cookie,
      );

      if (typeof result === 'string') this.mappingError(result, res);
      else this.setCookie(res, this.getSessionIdFromRefreshRecv(result));
    } catch (error) {
      return this.internalServerError(res);
    }
  }

  private async sendRefreshData(
    session_id_from_cookie: string,
  ): Promise<RefreshRecvDto | string> {
    return await firstValueFrom(
      this.client.send<undefined | string>(MsgAuthEnum.REFRESH, {
        session_id_from_cookie,
      }),
    );
  }

  private mappingError(error: string, res: Response): Response | undefined {
    switch (error) {
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

  private setCookie(res: Response, session_id: string): Response {
    return res.cookie('incidents_session_id', session_id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + DateEnum.THREE_DAYS),
    });
  }

  private getSessionIdFromRefreshRecv(result: RefreshRecvDto): string {
    const { session_id } = result as RefreshRecvDto;
    return session_id;
  }

  private internalServerError(res: Response): Response {
    return res
      .status(HttpStatusExtends.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
}
