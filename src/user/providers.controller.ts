import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AUTH_SERVICE_TAG, throwErrorIfExists } from '../libs/utils';
import { ClientProxy } from '@nestjs/microservices';
import { Public, UserAgent } from '../decorators';
import { firstValueFrom, mergeMap } from 'rxjs';
import { GoogleGuard } from '../guards';
import { YandexGuard } from '../guards/yandex.guard';
import { MicroserviceResponseStatus } from '../libs/dto';
import { MsgAuthEnum } from '../libs/enums';
import { handleTimeoutAndErrors } from '../libs/helpers';
import { QueryDecodePipe } from '../pipes';
import { AuthProvidersDto, UserAndTokensDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ResponseService } from './response.service';

@ApiTags('Providers')
@Controller('auth')
export class ProvidersController {
  constructor(
    @Inject(AUTH_SERVICE_TAG) private readonly client: ClientProxy,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly responseService: ResponseService,
  ) {}

  @Public()
  @UseGuards(GoogleGuard)
  @Get('google')
  async googleAuth() {}

  @Public()
  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    if (!req.user)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const token = req.user['accessToken'];
    const name = req.user['name'];
    const surname = req.user['surname'];
    return res.redirect(
      `${this.configService.get('GOOGLE_SUCCESS_REDIRECT_URL')}&token=${token}&name=${name}&surname=${surname}`,
    );
  }

  @Public()
  @Get('google/success')
  async googleSuccess(
    @Query('token', new QueryDecodePipe()) token: string,
    @Query('name', new QueryDecodePipe()) name: string,
    @Query('surname', new QueryDecodePipe()) surname: string,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await firstValueFrom(
      this.httpService
        .get(`${this.configService.get('GOOGLE_TOKEN_INFO_URL')}${token}`)
        .pipe(
          mergeMap(async ({ data: { email } }) => {
            const dto: AuthProvidersDto = {
              email,
              name,
              surname,
              userAgent,
            };
            return await firstValueFrom<
              UserAndTokensDto | MicroserviceResponseStatus
            >(
              this.client
                .send(MsgAuthEnum.GOOGLE_AUTH, dto)
                .pipe(handleTimeoutAndErrors()),
            );
          }),
          handleTimeoutAndErrors(),
        ),
    );
    throwErrorIfExists(result as MicroserviceResponseStatus);
    const { user, tokens } = result as UserAndTokensDto;
    this.responseService.setTokensInResponse(res, tokens);

    return { user, accessToken: tokens.accessToken };
  }

  @Public()
  @UseGuards(YandexGuard)
  @Get('yandex')
  async yandexAuth() {}

  @Public()
  @UseGuards(YandexGuard)
  @Get('yandex/callback')
  async yandexAuthCallback(@Req() req: Request, @Res() res: Response) {
    if (!req.user)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const token = req.user['accessToken'];
    const name = req.user['name'];
    const surname = req.user['surname'];
    return res.redirect(
      `${this.configService.get('YANDEX_SUCCESS_REDIRECT_URL')}&token=${token}&name=${name}&surname=${surname}`,
    );
  }

  @Public()
  @Get('yandex/success')
  async yandexSuccess(
    @Query('token', new QueryDecodePipe()) token: string,
    @Query('name', new QueryDecodePipe()) name: string,
    @Query('surname', new QueryDecodePipe()) surname: string,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await firstValueFrom(
      this.httpService
        .get(`${this.configService.get('YANDEX_TOKEN_INFO_URL')}${token}`)
        .pipe(
          mergeMap(async ({ data: { default_email } }) => {
            const dto: AuthProvidersDto = {
              email: default_email,
              name,
              surname,
              userAgent,
            };
            return await firstValueFrom<
              UserAndTokensDto | MicroserviceResponseStatus
            >(
              this.client
                .send(MsgAuthEnum.YANDEX_AUTH, dto)
                .pipe(handleTimeoutAndErrors()),
            );
          }),
          handleTimeoutAndErrors(),
        ),
    );

    throwErrorIfExists(result as MicroserviceResponseStatus);
    const { user, tokens } = result as UserAndTokensDto;
    this.responseService.setTokensInResponse(res, tokens);
    return { user, accessToken: tokens.accessToken };
  }
}
