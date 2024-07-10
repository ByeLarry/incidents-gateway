import { Inject, Injectable, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MsgAuthEnum } from 'src/utils/msg.auth.enum';

@Injectable()
export class AuthMiddleware {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}
  async use(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    next: () => void,
  ) {
    const session_id_from_cookie = req.cookies['incidents_session_id'];
    if (!session_id_from_cookie) {
      return res.status(401).json({ message: 'Session ID is missing' });
    }
    const csrf_token = req.body.csrf_token;

    if (!csrf_token) {
      return res.status(403).json({ message: 'CSRF token is missing' });
    }
    try {
      const result = await firstValueFrom(
        this.client.send(
          { cmd: MsgAuthEnum.AUTH },
          { session_id_from_cookie, csrf_token },
        ),
      );
      switch (result) {
        case '404':
          return res.status(404).json({ message: 'User not found' });
        case '403':
          return res.status(403).json({ message: 'CSRF token is missing' });
        case '401':
          return res.status(401).json({ message: 'Unauthorized' });
        case '419':
          return res.status(419).json({ message: 'Session expired' });
        case '500':
          return res.status(500).json({ message: 'Internal server error' });
        default:
          next();
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
