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
      result = await firstValueFrom(this.client.send({ cmd: 'signup' }, data));
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
    switch (result) {
      case '409':
        throw new HttpException('User already exists', 409);
      case '500':
        throw new HttpException('Internal server error', 500);
      default:
        const { session_id, ...rest } = result as UserRecvDto;
        res.cookie('incidents_session_id', session_id, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          expires: new Date(Date.now() + 60 * 60 * 1000),
        });
        return rest;
    }
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
      result = await firstValueFrom(this.client.send({ cmd: 'signin' }, data));
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
    switch (result) {
      case '404':
        throw new HttpException('User not found', 404);
      case '401':
        throw new HttpException('Wrong password', 401);
      case '500':
        throw new HttpException('Internal server error', 500);
      default:
        const { session_id, ...rest } = result as UserRecvDto;
        res.cookie('incidents_session_id', session_id, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          expires: new Date(Date.now() + 60 * 60 * 1000),
        });
        return rest;
    }
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
        this.client.send({ cmd: 'me' }, { session_id_from_cookie }),
      );
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
    switch (result) {
      case '404':
        throw new HttpException('User or session not found', 404);
      case '419':
        throw new HttpException('Session expired', 419);
      case '401':
        throw new HttpException('Unauthorized', 401);
      case '500':
        throw new HttpException('Internal server error', 500);
      default:
        const rest = result as UserRecvDto;
        delete rest.session_id;
        return rest;
    }
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
          { cmd: 'logout' },
          { csrf_token: data.csrf_token, session_id_from_cookie },
        ),
      );
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
    switch (result) {
      case '404':
        throw new HttpException('User or session not found', 404);
      case '403':
        throw new HttpException('Forbidden', 403);
      case '419':
        throw new HttpException('Session expired', 419);
      case '401':
        throw new HttpException('Session ID is missing', 401);
      case '500':
        throw new HttpException('Internal server error', 500);
      case '200':
        res.cookie('incidents_session_id', '', {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          expires: new Date(0),
        });
        return { message: 'User signed out successfully' };
    }
  }
}
