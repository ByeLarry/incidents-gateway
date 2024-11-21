import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { DateEnum } from '../libs/enums';
import { REFRESH_TOKEN_COOKIE_NAME } from '../libs/utils';
import { ITokens } from '../interfaces';

@Injectable()
export class ResponseService {
  public setTokensInResponse(res: Response, tokens: ITokens) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken.value, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + DateEnum.THIRTY_DAYS),
    });
  }

  public clearRefreshToken(res: Response) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(),
    });
  }

  public disableCache(res: Response) {
    res.set({
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
      Expires: '0',
    });
  }
}
