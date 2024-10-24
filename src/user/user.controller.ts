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
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { firstValueFrom, mergeMap } from 'rxjs';
import { Request, Response } from 'express';
import {
  AUTH_SERVICE_TAG,
  REFRESH_TOKEN_COOKIE_NAME,
  throwErrorIfExists,
} from '../libs/utils';
import { MicroserviceResponseStatus, PaginationDto } from '../libs/dto';
import { DateEnum, MsgAuthEnum, RolesEnum } from '../libs/enums';
import { Cookie, Public, Roles, UserAgent } from '../decorators';
import {
  AccessTokenDto,
  AddAdminDto,
  AdminLoginDto,
  AuthProvidersDto,
  CreateUserDto,
  DeleteUserDto,
  RefreshTokenValueAndUserAgentDto,
  UpdateAdminDto,
  UserAndTokensDto,
  UserDto,
  UserIdAndAccessTokenValueDto,
  UserIdDto,
} from './dto';
import { ITokens } from '../interfaces';
import { GoogleGuard } from '../guards/google.guard';
import { HttpService } from '@nestjs/axios';
import { handleTimeoutAndErrors } from '../libs/helpers';
import { ConfigService } from '@nestjs/config';
import { YandexGuard } from '../guards/yandex.guard';
import { QueryDecodePipe } from '../pipes';
import { ApiTags } from '@nestjs/swagger';

type AsyncFunction<T> = () => Promise<T>;

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(
    @Inject(AUTH_SERVICE_TAG) private client: ClientProxy,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async handleAsyncOperation<T>(
    operation: AsyncFunction<T>,
  ): Promise<T | MicroserviceResponseStatus> {
    try {
      return await operation();
    } catch (error) {
      console.error(error);
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
    throwErrorIfExists(result as MicroserviceResponseStatus);
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
    throwErrorIfExists(result as MicroserviceResponseStatus);
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
    res.set({
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
      Expires: '0',
    });
    const result = await this.handleAsyncOperation(async () => {
      const data: RefreshTokenValueAndUserAgentDto = {
        value: refreshToken,
        userAgent,
      };
      return await firstValueFrom<UserDto | MicroserviceResponseStatus>(
        this.client.send(MsgAuthEnum.ME, data),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
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
    throwErrorIfExists(result as MicroserviceResponseStatus);
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
    throwErrorIfExists(result as MicroserviceResponseStatus);
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(),
    });
    res.status(HttpStatus.NO_CONTENT);
  }

  @Delete()
  async deleteUser(
    @Headers('authorization') accessToken: string,
    @Query() dto: DeleteUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const result = await this.handleAsyncOperation(async () => {
      const data: UserIdAndAccessTokenValueDto = {
        accessTokenValue: accessToken.replace('Bearer ', ''),
        userId: dto.userId,
      };
      return await firstValueFrom<MicroserviceResponseStatus>(
        this.client.send(MsgAuthEnum.DELETE, data),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(),
    });
    res.status(HttpStatus.NO_CONTENT);
  }

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
    const result = await this.handleAsyncOperation(async () => {
      return firstValueFrom(
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
              >(this.client.send(MsgAuthEnum.GOOGLE_AUTH, dto));
            }),
            handleTimeoutAndErrors(),
          ),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
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
    const result = await this.handleAsyncOperation(async () => {
      return firstValueFrom(
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
              >(this.client.send(MsgAuthEnum.YANDEX_AUTH, dto));
            }),
            handleTimeoutAndErrors(),
          ),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
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
  @Post('admin-login')
  async adminLogin(
    @Body() data: AdminLoginDto,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.handleAsyncOperation(async () => {
      const adminData: AdminLoginDto = {
        ...data,
        userAgent,
      };
      return await firstValueFrom<
        UserAndTokensDto | MicroserviceResponseStatus
      >(this.client.send(MsgAuthEnum.ADMIN_LOGIN, adminData));
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    const { user, tokens } = result as UserAndTokensDto;
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken.value, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + DateEnum.THIRTY_DAYS),
    });
    return { user, accessToken: tokens.accessToken };
  }

  @Roles(RolesEnum.ADMIN)
  @Get('users')
  async getUsers(@Query() dto: PaginationDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client.send(MsgAuthEnum.GET_ALL_USERS, dto),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @Patch('block')
  async blockUser(@Body() dto: UserIdDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client.send(MsgAuthEnum.BLOCK_USER, dto),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @Patch('unblock')
  async unblockUser(@Body() dto: UserIdDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client.send(MsgAuthEnum.UNBLOCK_USER, dto),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @Patch('admin')
  async updateAdmin(
    @Body() dto: UpdateAdminDto,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client.send(MsgAuthEnum.UPDATE_ADMIN, { ...dto, userAgent }),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    const { user, tokens } = result as UserAndTokensDto;
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken.value, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + DateEnum.THIRTY_DAYS),
    });
    return { user, accessToken: tokens.accessToken };
  }

  @Roles(RolesEnum.ADMIN)
  @Post('admin/create-user')
  async createUserByAdmin(@Body() dto: CreateUserDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client.send(MsgAuthEnum.CREATE_USER_BY_ADMIN, dto),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @Delete('admin/:id')
  async deleteUserByAdmin(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @Headers('authorization') accessToken: string,
  ) {
    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const result = await this.handleAsyncOperation(async () => {
      const data: UserIdAndAccessTokenValueDto = {
        accessTokenValue: accessToken.replace('Bearer ', ''),
        userId: id,
      };
      return await firstValueFrom<MicroserviceResponseStatus>(
        this.client.send(MsgAuthEnum.DELETE, data),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    res.status(HttpStatus.NO_CONTENT);
  }

  @Roles(RolesEnum.ADMIN)
  @Patch('admin/add')
  async addAdminRoleToUser(@Body() dto: AddAdminDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client.send(MsgAuthEnum.ADD_ADMIN_ROLE_TO_USER, dto),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @Get('stats')
  async getStats() {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client.send(MsgAuthEnum.USERS_STATS, {}),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }
}
