import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  HttpStatus,
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
        this.client.send({ cmd: 'signup' }, { data }),
      );
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    switch (result) {
      case '409':
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      case '500':
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
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
      result = await firstValueFrom(
        this.client.send({ cmd: 'signin' }, { data }),
      );
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    switch (result) {
      case '404':
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      case '401':
        throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
      case '500':
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
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
  async me(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const session_id_from_cookie = req.cookies['incidents_session_id'];
    if (!session_id_from_cookie) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    let result: UserRecvDto | string;
    try {
      result = await firstValueFrom(
        this.client.send({ cmd: 'me' }, { session_id_from_cookie }),
      );
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    switch (result) {
      case '404':
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      case '419':
        throw new HttpException('Session expired', 419);
      case '500':
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
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
}
