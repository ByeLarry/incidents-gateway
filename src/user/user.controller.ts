import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  Res,
  Get,
  Req,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';
import { UserDto } from './dto/user.dto';
import { LogoutDto } from './dto/logout.dto';
import { LogoutRecvDto } from './dto/logout-recv.dto';
import {
  AUTH_SERVICE_TAG,
  errorSwitch,
  SESSION_ID_COOKIE_NAME,
} from '../libs/utils';
import { MicroserviceResponseStatus } from '../libs/dto';
import { DateEnum, HttpStatusExtends, MsgAuthEnum } from '../libs/enums';

type AsyncFunction<T> = () => Promise<T>;

@ApiTags('Auth')
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
        HttpStatusExtends.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: HttpStatusExtends.CREATED,
    description: 'User created successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatusExtends.CONFLICT,
    description: 'User already exists',
  })
  @ApiResponse({
    status: HttpStatusExtends.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post('signup')
  async signup(
    @Body() data: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: UserDto | MicroserviceResponseStatus =
      await this.handleAsyncOperation(async () => {
        return await firstValueFrom<UserDto | MicroserviceResponseStatus>(
          this.client.send(MsgAuthEnum.SIGNUP, data),
        );
      });
    errorSwitch(result as MicroserviceResponseStatus);
    const { session_id, ...rest } = result as UserDto;
    res.cookie(SESSION_ID_COOKIE_NAME, session_id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + DateEnum.THREE_DAYS),
    });
    return rest;
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: HttpStatusExtends.OK,
    description: 'User signed in successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatusExtends.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatusExtends.UNAUTHORIZED,
    description: 'Wrong password',
  })
  @ApiResponse({
    status: HttpStatusExtends.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post('signin')
  async signin(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<UserDto | MicroserviceResponseStatus>(
        this.client.send(MsgAuthEnum.SIGNIN, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    const { session_id, ...rest } = result as UserDto;
    res.cookie(SESSION_ID_COOKIE_NAME, session_id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + DateEnum.THREE_DAYS),
    });
    return rest;
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: HttpStatusExtends.OK,
    description: 'User retrieved successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatusExtends.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatusExtends.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatusExtends.SESSION_EXPIRED,
    description: 'Session expired',
  })
  @ApiResponse({
    status: HttpStatusExtends.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiCookieAuth()
  @Get('me')
  async me(@Req() req: Request) {
    const session_id_from_cookie = req.cookies[SESSION_ID_COOKIE_NAME];
    if (!session_id_from_cookie) {
      throw new HttpException('Unauthorized', HttpStatusExtends.UNAUTHORIZED);
    }
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<UserDto | MicroserviceResponseStatus>(
        this.client.send(MsgAuthEnum.ME, { session_id_from_cookie }),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    const rest = result as UserDto;
    delete rest.session_id;
    return rest;
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: HttpStatusExtends.NO_CONTENT,
    description: 'User signed out successfully',
    type: LogoutRecvDto,
  })
  @ApiResponse({
    status: HttpStatusExtends.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatusExtends.SESSION_EXPIRED,
    description: 'Session expired',
  })
  @ApiResponse({
    status: HttpStatusExtends.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatusExtends.FORBIDDEN,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: HttpStatusExtends.UNAUTHORIZED,
    description: 'Session ID is missing',
  })
  @ApiBody({ type: LogoutDto })
  @ApiCookieAuth()
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() data: LogoutDto,
  ) {
    const session_id_from_cookie = req.cookies[SESSION_ID_COOKIE_NAME];
    if (!session_id_from_cookie) {
      throw new HttpException('Unauthorized', HttpStatusExtends.UNAUTHORIZED);
    }
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<LogoutRecvDto | MicroserviceResponseStatus>(
        this.client.send(MsgAuthEnum.LOGOUT, {
          csrf_token: data.csrf_token,
          session_id_from_cookie,
        }),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    res.cookie(SESSION_ID_COOKIE_NAME, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(),
    });
    res.status(HttpStatusExtends.NO_CONTENT);
  }
}
