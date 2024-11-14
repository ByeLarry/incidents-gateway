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
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { firstValueFrom, mergeMap } from 'rxjs';
import { Request, Response } from 'express';
import {
  AUTH_SERVICE_TAG,
  MicroserviceResponseStatusFabric,
  REFRESH_TOKEN_COOKIE_NAME,
  throwErrorIfExists,
  TIMEOUT_ERROR_MESSAGE,
} from '../libs/utils';
import { MicroserviceResponseStatus, PaginationDto } from '../libs/dto';
import { DateEnum, IndexesEnum, MsgAuthEnum, RolesEnum } from '../libs/enums';
import { Cookie, Public, Roles, UserAgent } from '../decorators';
import {
  AccessTokenDto,
  AddAdminDto,
  AdminLoginDto,
  AuthProvidersDto,
  CreateUserDto,
  DeleteUserDto,
  RefreshTokenValueAndUserAgentDto,
  SearchDto,
  UpdateAdminDto,
  UserAndTokensDto,
  UserDto,
  UserIdAndAccessTokenValueDto,
  UserIdDto,
} from './dto';
import { ITokens } from '../interfaces';
import { GoogleGuard } from '../guards/google.guard';
import { HttpService } from '@nestjs/axios';
import { AppLoggerService, handleTimeoutAndErrors } from '../libs/helpers';
import { ConfigService } from '@nestjs/config';
import { YandexGuard } from '../guards/yandex.guard';
import { QueryDecodePipe } from '../pipes';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../guards';

type AsyncFunction<T> = () => Promise<T>;

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(
    @Inject(AUTH_SERVICE_TAG) private client: ClientProxy,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  private async handleAsyncOperation<T>(
    operation: AsyncFunction<T>,
  ): Promise<T | MicroserviceResponseStatus> {
    try {
      return await operation();
    } catch (error) {
      this.logger.error(`Message - ${error.message}`);
      if (error.message === TIMEOUT_ERROR_MESSAGE)
        throw new HttpException(error.message, HttpStatus.REQUEST_TIMEOUT);
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
        this.checkRecaptcha(data);
        delete data.recaptchaToken;
        return await firstValueFrom<
          UserAndTokensDto | MicroserviceResponseStatus
        >(
          this.client
            .send(MsgAuthEnum.SIGNUP, { ...data, userAgent })
            .pipe(handleTimeoutAndErrors()),
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
  @Post('signin')
  async signin(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
  ) {
    const result = await this.handleAsyncOperation(async () => {
      this.checkRecaptcha(data);
      delete data.recaptchaToken;
      return await firstValueFrom<
        UserAndTokensDto | MicroserviceResponseStatus
      >(
        this.client
          .send(MsgAuthEnum.SIGNIN, { ...data, userAgent })
          .pipe(handleTimeoutAndErrors()),
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
        this.client.send(MsgAuthEnum.ME, data).pipe(handleTimeoutAndErrors()),
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
        this.client
          .send(MsgAuthEnum.REFRESH, data)
          .pipe(handleTimeoutAndErrors()),
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
        this.client
          .send(MsgAuthEnum.LOGOUT, data)
          .pipe(handleTimeoutAndErrors()),
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
        this.client
          .send(MsgAuthEnum.DELETE, data)
          .pipe(handleTimeoutAndErrors()),
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
              >(
                this.client
                  .send(MsgAuthEnum.GOOGLE_AUTH, dto)
                  .pipe(handleTimeoutAndErrors()),
              );
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
              >(
                this.client
                  .send(MsgAuthEnum.YANDEX_AUTH, dto)
                  .pipe(handleTimeoutAndErrors()),
              );
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
  @Post('admin/login')
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
      >(
        this.client
          .send(MsgAuthEnum.ADMIN_LOGIN, adminData)
          .pipe(handleTimeoutAndErrors()),
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
  @UseGuards(RolesGuard)
  @Get('admin/users')
  async getUsers(@Query() dto: PaginationDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client
          .send(MsgAuthEnum.GET_ALL_USERS, dto)
          .pipe(handleTimeoutAndErrors()),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/block')
  async blockUser(@Body() dto: UserIdDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client
          .send(MsgAuthEnum.BLOCK_USER, dto)
          .pipe(handleTimeoutAndErrors()),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/unblock')
  async unblockUser(@Body() dto: UserIdDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client
          .send(MsgAuthEnum.UNBLOCK_USER, dto)
          .pipe(handleTimeoutAndErrors()),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin')
  async updateAdmin(
    @Body() dto: UpdateAdminDto,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client
          .send(MsgAuthEnum.UPDATE_ADMIN, { ...dto, userAgent })
          .pipe(handleTimeoutAndErrors()),
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
  @UseGuards(RolesGuard)
  @Post('admin/create-user')
  async createUserByAdmin(@Body() dto: CreateUserDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client
          .send(MsgAuthEnum.CREATE_USER_BY_ADMIN, dto)
          .pipe(handleTimeoutAndErrors()),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
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
        this.client
          .send(MsgAuthEnum.DELETE, data)
          .pipe(handleTimeoutAndErrors()),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    res.status(HttpStatus.NO_CONTENT);
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/add')
  async addAdminRoleToUser(@Body() dto: AddAdminDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client
          .send(MsgAuthEnum.ADD_ADMIN_ROLE_TO_USER, dto)
          .pipe(handleTimeoutAndErrors()),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin/stats')
  async getStats() {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client
          .send(MsgAuthEnum.USERS_STATS, {})
          .pipe(handleTimeoutAndErrors()),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin/search')
  async search(@Query() queries: { query: string }) {
    const result = await this.handleAsyncOperation(async () => {
      const searchDto: SearchDto = {
        query: queries.query,
        index: IndexesEnum.USERS,
      };
      return await firstValueFrom(
        this.client
          .send(MsgAuthEnum.SEARCH_USERS, searchDto)
          .pipe(handleTimeoutAndErrors()),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }

  private async checkRecaptcha(data: SignInDto | SignUpDto) {
    const recaptchaResponse = await this.httpService.axiosRef.post(
      `${this.configService.get('RECAPTCHA_VERIFY_API')}?secret=${this.configService.get(
        'RECAPTCHA_SECRET_KEY',
      )}&response=${data.recaptchaToken}`,
    );
    if (recaptchaResponse.data.success === false)
      return MicroserviceResponseStatusFabric.create(HttpStatus.FORBIDDEN);
    else return MicroserviceResponseStatusFabric.create(HttpStatus.OK);
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Put('admin/reindex')
  async reindexSearhchEngine() {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom(
        this.client
          .send(MsgAuthEnum.REINDEX, {})
          .pipe(handleTimeoutAndErrors()),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }
}
