import { Inject, Injectable, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { RefreshRecvDto } from 'src/user/dto/refresh-recv.dto';
import { MsgAuthEnum } from 'src/utils/msg.auth.enum';

@Injectable()
export class RefreshMiddleware {
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

    try {
      const result: RefreshRecvDto | string = await firstValueFrom(
        this.client.send(
          { cmd: MsgAuthEnum.REFRESH },
          { session_id_from_cookie },
        ),
      );
      switch (result) {
        case '404':
          return res.status(404).json({ message: 'User not found' });
        case '401':
          return res.status(401).json({ message: 'Unauthorized' });
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
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          });
          next();
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
