import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  Res,
  Get,
  HttpStatus,
  Delete,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { AUTH_SERVICE_TAG, REFRESH_TOKEN_COOKIE_NAME } from '../libs/utils';
import { MsgAuthEnum, RolesEnum } from '../libs/enums';
import { Cookie, Public, Roles, UserAgent } from '../libs/decorators';
import {
  AccessTokenDto,
  DeleteUserDto,
  RefreshTokenValueAndUserAgentDto,
  UserAndTokensDto,
  UserIdAndAccessTokenValueDto,
} from './dto';
import { ITokens } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { MicroserviceSenderService } from '../libs/services';
import { HttpService } from '@nestjs/axios';
import { ResponseService } from './response.service';
import {
  ApiDocDeleteUser,
  ApiDocGetUser,
  ApiDocLogout,
  ApiDocRefreshTokens,
  ApiDocUserSignIn,
  ApiDocUserSignUp,
} from './docs';
import { RolesGuard } from '../libs/guards';

@ApiTags('User')
@Controller('auth')
export class UserController {
  constructor(
    @Inject(AUTH_SERVICE_TAG) private client: ClientProxy,
    private readonly configService: ConfigService,
    private readonly senderService: MicroserviceSenderService,
    private readonly httpService: HttpService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiDocUserSignUp()
  @Public()
  @Post('signup')
  async signup(
    @Body() data: SignUpDto,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
  ) {
    this.checkRecaptcha(data);
    delete data.recaptchaToken;
    const result = await this.senderService.send(
      this.client,
      MsgAuthEnum.SIGNUP,
      {
        ...data,
        userAgent,
      },
    );
    const { user, tokens } = result as UserAndTokensDto;
    this.responseService.setTokensInResponse(res, tokens);
    return { user, accessToken: tokens.accessToken };
  }

  @ApiDocUserSignIn()
  @Public()
  @Post('signin')
  async signin(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
  ) {
    this.checkRecaptcha(data);
    delete data.recaptchaToken;
    const result = await this.senderService.send(
      this.client,
      MsgAuthEnum.SIGNIN,
      { ...data, userAgent },
    );
    const { user, tokens } = result as UserAndTokensDto;
    this.responseService.setTokensInResponse(res, tokens);
    return { user, accessToken: tokens.accessToken };
  }

  @ApiDocGetUser(RolesEnum.USER)
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.USER)
  @Get('me')
  async me(
    @Cookie(REFRESH_TOKEN_COOKIE_NAME) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
  ) {
    if (!refreshToken || !userAgent) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    this.responseService.disableCache(res);

    const data: RefreshTokenValueAndUserAgentDto = {
      value: refreshToken,
      userAgent,
    };
    return this.senderService.send(this.client, MsgAuthEnum.ME, data);
  }

  @ApiDocRefreshTokens()
  @Public()
  @Post('refresh')
  async refreshTokens(
    @Cookie(REFRESH_TOKEN_COOKIE_NAME) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
  ) {
    if (!refreshToken || !userAgent)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const data: RefreshTokenValueAndUserAgentDto = {
      value: refreshToken,
      userAgent,
    };

    const result = await this.senderService.send(
      this.client,
      MsgAuthEnum.REFRESH,
      data,
    );
    const { accessToken } = result as ITokens;
    this.responseService.setTokensInResponse(res, result as ITokens);

    const response: AccessTokenDto = { value: accessToken };
    return response;
  }

  @ApiDocLogout(RolesEnum.USER)
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.USER)
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

    const data: RefreshTokenValueAndUserAgentDto = {
      value: refreshToken,
      userAgent,
    };

    await this.senderService.send(this.client, MsgAuthEnum.LOGOUT, data);
    this.responseService.clearRefreshToken(res);
    res.status(HttpStatus.NO_CONTENT);
  }

  @ApiDocDeleteUser(RolesEnum.USER)
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.USER)
  @Delete()
  async delete(
    @Headers('authorization') accessToken: string,
    @Query() dto: DeleteUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!accessToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const data: UserIdAndAccessTokenValueDto = {
      accessTokenValue: accessToken.replace('Bearer ', ''),
      userId: dto.userId,
    };

    await this.senderService.send(this.client, MsgAuthEnum.DELETE, data);
    this.responseService.clearRefreshToken(res);
    res.status(HttpStatus.NO_CONTENT);
  }

  private async checkRecaptcha(data: SignInDto | SignUpDto) {
    const recaptchaResponse = await this.httpService.axiosRef.post(
      `${this.configService.get('RECAPTCHA_VERIFY_API')}?secret=${this.configService.get(
        'RECAPTCHA_SECRET_KEY',
      )}&response=${data.recaptchaToken}`,
    );
    if (recaptchaResponse.data.success === false)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
