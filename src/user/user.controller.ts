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
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';
import { UserRecvDto } from './dto/user-recv.dto';

@Controller('api/auth')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @Post('signup')
  async signup(
    @Body() data: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: UserRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: 'signup' }, data),
    );
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

  @Post('signin')
  async signin(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: UserRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: 'signin' }, data),
    );
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

  @Get('me')
  async me(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const session_id_from_cookie = req.cookies['incidents_session_id'];
    if (!session_id_from_cookie) {
      throw new HttpException('Unauthorized', 401);
    }
    const result: UserRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: 'me' }, { session_id_from_cookie }),
    );
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
