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
import { MsgAuthEnum } from 'src/utils/msg.auth.enum';
import { errorSwitch } from 'src/utils/errors';

@ApiTags('Auth')
@Controller('api/auth')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserRecvDto,
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('signup')
  async signup(
    @Body() data: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    let result: UserRecvDto | string;
    try {
      result = await firstValueFrom(
        this.client.send({ cmd: MsgAuthEnum.SIGNUP }, data),
      );
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
    errorSwitch(result as string);
    const { session_id, ...rest } = result as UserRecvDto;
    res.cookie('incidents_session_id', session_id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    return rest;
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
    type: UserRecvDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Wrong password' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('signin')
  async signin(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    let result: UserRecvDto | string;
    try {
      result = await firstValueFrom(
        this.client.send({ cmd: MsgAuthEnum.SIGNIN }, data),
      );
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
    errorSwitch(result as string);
    const { session_id, ...rest } = result as UserRecvDto;
    res.cookie('incidents_session_id', session_id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    return rest;
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserRecvDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 419, description: 'Session expired' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  @Get('me')
  async me(@Req() req: Request) {
    const session_id_from_cookie = req.cookies['incidents_session_id'];
    if (!session_id_from_cookie) {
      throw new HttpException('Unauthorized', 401);
    }
    let result: UserRecvDto | string;
    try {
      result = await firstValueFrom(
        this.client.send({ cmd: MsgAuthEnum.ME }, { session_id_from_cookie }),
      );
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
    errorSwitch(result as string);
    const rest = result as UserRecvDto;
    delete rest.session_id;
    return rest;
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: 200,
    description: 'User signed out successfully',
    type: LogoutRecvDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 419, description: 'Session expired' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Session ID is missing' })
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
      throw new HttpException('Unauthorized', 401);
    }
    let result: string;
    try {
      result = await firstValueFrom(
        this.client.send(
          { cmd: MsgAuthEnum.LOGOUT },
          { csrf_token: data.csrf_token, session_id_from_cookie },
        ),
      );
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
    errorSwitch(result);
    res.cookie('incidents_session_id', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
    });
    return { message: 'User signed out successfully' };
  }
}
