import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { RefreshRecvDto } from 'src/user/dto/refresh-recv.dto';

@Injectable()
export class RefreshMiddleware {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}
  async use(req: Request, res: Response, next: () => void) {
    const csrf_token = req.body.csrf_token;
    if (!csrf_token) {
      return res.status(403).json({ message: 'CSRF token is missing' });
    }
    const session_id_from_cookie = req.cookies['incidents_session_id'];
    if (!session_id_from_cookie) {
      return res.status(401).json({ message: 'Session ID is missing' });
    }

    try {
      const result: RefreshRecvDto | string = await firstValueFrom(
        this.client.send(
          { cmd: 'refresh' },
          { csrf_token, session_id_from_cookie },
        ),
      );
      switch (result) {
        case '404':
          return res.status(404).json({ message: 'User or session not found' });
        case '403':
          return res.status(403).json({ message: 'Forbidden' });
        case '419':
          return res.status(419).json({ message: 'Session expired' });
        case '500':
          return res.status(500).json({ message: 'Internal server error' });
        default:
          const { session_id } = result as RefreshRecvDto;
          res.cookie('incidents_session_id', session_id, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 60 * 60 * 1000),
          });
          next();
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
