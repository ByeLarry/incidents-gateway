import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  Res,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import {
  AUTH_SERVICE_TAG,
  errorSwitch,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../libs/utils';
import { MicroserviceResponseStatus } from '../libs/dto';
import { DateEnum, MsgAuthEnum } from '../libs/enums';
import { Cookie, Public, UserAgent } from '../decorators';
import {
  AccessTokenDto,
  RefreshTokenValueAndUserAgentDto,
  UserAndTokensDto,
  UserDto,
} from './dto';
import { ITokens } from '../interfaces';

type AsyncFunction<T> = () => Promise<T>;

@Controller('auth')
export class UserController {
  constructor(@Inject(AUTH_SERVICE_TAG) private client: ClientProxy) {}

  private async handleAsyncOperation<T>(
    operation: AsyncFunction<T>,
  ): Promise<T | MicroserviceResponseStatus> {
    try {
      return await operation();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Post('signup')
  async signup(
    @Body() data: SignUpDto,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
  ) {
    const result: UserAndTokensDto | MicroserviceResponseStatus =
      await this.handleAsyncOperation(async () => {
        return await firstValueFrom<
          UserAndTokensDto | MicroserviceResponseStatus
        >(this.client.send(MsgAuthEnum.SIGNUP, { ...data, userAgent }));
      });
    errorSwitch(result as MicroserviceResponseStatus);
    const { user, tokens } = result as UserAndTokensDto;
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken.value, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + DateEnum.THIRTY_DAYS),
    });
    return { user, accessToken: tokens.accessToken };
  }

  @Public()
  @Post('signin')
  async signin(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
  ) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<
        UserAndTokensDto | MicroserviceResponseStatus
      >(this.client.send(MsgAuthEnum.SIGNIN, { ...data, userAgent }));
    });
    errorSwitch(result as MicroserviceResponseStatus);
    const { user, tokens } = result as UserAndTokensDto;
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken.value, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + DateEnum.THIRTY_DAYS),
    });
    return { user, accessToken: tokens.accessToken };
  }

  @Get('me')
  async me(
    @Cookie(REFRESH_TOKEN_COOKIE_NAME) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
  ) {
    if (!refreshToken || !userAgent) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const result = await this.handleAsyncOperation(async () => {
      const data: RefreshTokenValueAndUserAgentDto = {
        value: refreshToken,
        userAgent,
      };
      return await firstValueFrom<UserDto | MicroserviceResponseStatus>(
        this.client.send(MsgAuthEnum.ME, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    return result as UserDto;
  }

  @Public()
  @Post('refresh')
  async refreshTokens(
    @Cookie(REFRESH_TOKEN_COOKIE_NAME) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
  ) {
    if (!refreshToken || !userAgent) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const result = await this.handleAsyncOperation(async () => {
      const data: RefreshTokenValueAndUserAgentDto = {
        value: refreshToken,
        userAgent,
      };
      return await firstValueFrom<ITokens | MicroserviceResponseStatus>(
        this.client.send(MsgAuthEnum.REFRESH, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    const { accessToken, refreshToken: newRefreshToken } = result as ITokens;
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken.value, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + DateEnum.THIRTY_DAYS),
    });
    const response: AccessTokenDto = { value: accessToken };
    return response;
  }

  @Post('logout')
  async logout(
    @Cookie(REFRESH_TOKEN_COOKIE_NAME) refreshToken: string,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }
    const result = await this.handleAsyncOperation(async () => {
      const data: RefreshTokenValueAndUserAgentDto = {
        value: refreshToken,
        userAgent,
      };
      return await firstValueFrom<MicroserviceResponseStatus>(
        this.client.send(MsgAuthEnum.LOGOUT, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(),
    });
    res.status(HttpStatus.NO_CONTENT);
  }
}
