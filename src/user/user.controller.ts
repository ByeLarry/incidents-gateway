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
import { UserRecvDto } from './dto/user-recv.dto';
import { LogoutDto } from './dto/logout.dto';
import { LogoutRecvDto } from './dto/logout-recv.dto';
import { MsgAuthEnum } from '../utils/msg.auth.enum';
import { errorSwitch } from '../utils/errors';
import { HttpStatusExtends } from '../utils/extendsHttpStatus.enum';
import { DateEnum } from '../utils/date.enum';
import { AUTH_SERVICE_TAG } from '../utils/auth.service.provide';

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(@Inject(AUTH_SERVICE_TAG) private client: ClientProxy) {}

  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: HttpStatusExtends.CREATED,
    description: 'User created successfully',
    type: UserRecvDto,
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
    let result: UserRecvDto | string;
    try {
      result = await firstValueFrom(this.client.send(MsgAuthEnum.SIGNUP, data));
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatusExtends.INTERNAL_SERVER_ERROR,
      );
    }
    errorSwitch(result as string);
    const { session_id, ...rest } = result as UserRecvDto;
    res.cookie('incidents_session_id', session_id, {
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
    type: UserRecvDto,
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
    let result: UserRecvDto | string;
    try {
      result = await firstValueFrom(this.client.send(MsgAuthEnum.SIGNIN, data));
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatusExtends.INTERNAL_SERVER_ERROR,
      );
    }
    errorSwitch(result as string);
    const { session_id, ...rest } = result as UserRecvDto;
    res.cookie('incidents_session_id', session_id, {
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
    type: UserRecvDto,
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
    const session_id_from_cookie = req.cookies['incidents_session_id'];
    if (!session_id_from_cookie) {
      throw new HttpException('Unauthorized', HttpStatusExtends.UNAUTHORIZED);
    }
    let result: UserRecvDto | string;
    try {
      result = await firstValueFrom(
        this.client.send(MsgAuthEnum.ME, { session_id_from_cookie }),
      );
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatusExtends.INTERNAL_SERVER_ERROR,
      );
    }
    errorSwitch(result as string);
    const rest = result as UserRecvDto;
    delete rest.session_id;
    return rest;
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: HttpStatusExtends.OK,
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
    const session_id_from_cookie = req.cookies['incidents_session_id'];
    if (!session_id_from_cookie) {
      throw new HttpException('Unauthorized', HttpStatusExtends.UNAUTHORIZED);
    }
    let result: string;
    try {
      result = await firstValueFrom(
        this.client.send(MsgAuthEnum.LOGOUT, {
          csrf_token: data.csrf_token,
          session_id_from_cookie,
        }),
      );
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatusExtends.INTERNAL_SERVER_ERROR,
      );
    }
    errorSwitch(result);
    res.cookie('incidents_session_id', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(),
    });
    return { message: 'User signed out successfully' };
  }
}
