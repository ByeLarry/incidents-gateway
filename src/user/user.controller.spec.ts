/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { of, throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UserRecvDto } from './dto/user-recv.dto';
import { LogoutDto } from './dto/logout.dto';
import { LogoutRecvDto } from './dto/logout-recv.dto';
import { MsgAuthEnum } from '../utils/msg.auth.enum';
import { DateEnum } from '../utils/date.enum';
import { AUTH_SERVICE_TAG } from '../utils/auth.service.provide';

const mockClientProxy = {
  send: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let client: ClientProxy;
  let res: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: AUTH_SERVICE_TAG,
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    client = module.get<ClientProxy>(AUTH_SERVICE_TAG);

    res = {
      cookie: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should successfully sign up a user', async () => {
      const mockSignUpDto: SignUpDto = {
        surname: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
        name: 'testuser',
      };
      const mockUserRecvDto: UserRecvDto = {
        name: 'testuser',
        surname: 'testuser',
        _id: '1',
        email: 'test@example.com',
        session_id: 'sessionId',
        activated: false,
        csrf_token: 'token',
      };

      jest.spyOn(client, 'send').mockReturnValue(of(mockUserRecvDto));

      const result = await controller.signup(mockSignUpDto, res);

      expect(client.send).toHaveBeenCalledWith(
        { cmd: MsgAuthEnum.SIGNUP },
        mockSignUpDto,
      );

      const { session_id, ...expectedResult } = mockUserRecvDto;
      expect(result).toEqual(expectedResult);

      expect(res.cookie).toHaveBeenCalledWith(
        'incidents_session_id',
        'sessionId',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          expires: expect.any(Date),
        }),
      );
    });

    it('should throw an error if user already exists', async () => {
      jest
        .spyOn(client, 'send')
        .mockReturnValue(throwError(() => 'User already exists'));

      await expect(controller.signup({} as SignUpDto, res)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('signin', () => {
    it('should successfully sign in a user', async () => {
      const mockSignInDto: SignInDto = {
        email: 'test@test.test',
        password: 'testpassword',
      };
      const mockUserRecvDto: UserRecvDto = {
        name: 'testuser',
        surname: 'testuser',
        _id: '1',
        email: 'test@test.test',
        session_id: 'sessionId',
        activated: false,
        csrf_token: 'token',
      };

      jest.spyOn(client, 'send').mockReturnValue(of(mockUserRecvDto));

      const result = await controller.signin(mockSignInDto, res);

      const { session_id, ...expectedResult } = mockUserRecvDto;

      expect(client.send).toHaveBeenCalledWith(
        { cmd: MsgAuthEnum.SIGNIN },
        mockSignInDto,
      );
      expect(result).toEqual(expectedResult);
      expect(res.cookie).toHaveBeenCalledWith(
        'incidents_session_id',
        'sessionId',
        {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          expires: expect.any(Date),
        },
      );
    });

    it('should throw an error if user not found or wrong password', async () => {
      jest
        .spyOn(client, 'send')
        .mockReturnValue(throwError(() => 'Wrong password'));

      await expect(controller.signin({} as SignInDto, res)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('me', () => {
    it('should retrieve user information successfully', async () => {
      const req: Partial<Request> = {
        cookies: { incidents_session_id: 'sessionId' },
      };
      const mockUserRecvDto: UserRecvDto = {
        name: 'testuser',
        surname: 'testuser',
        _id: '1',
        email: 'test@example.com',
        session_id: 'sessionId',
        activated: false,
        csrf_token: 'token',
      };

      jest.spyOn(client, 'send').mockReturnValue(of(mockUserRecvDto));

      const result = await controller.me(req as Request);

      const { session_id, ...expectedResult } = mockUserRecvDto;

      expect(client.send).toHaveBeenCalledWith(
        { cmd: MsgAuthEnum.ME },
        { session_id_from_cookie: 'sessionId' },
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if session ID is missing', async () => {
      const req = {
        cookies: {},
      } as Request;

      await expect(controller.me(req)).rejects.toThrow(HttpException);
    });
  });

  describe('logout', () => {
    it('should successfully log out a user', async () => {
      const req: Partial<Request> = {
        cookies: { incidents_session_id: 'sessionId' },
      };
      const mockLogoutDto: LogoutDto = { csrf_token: 'token' };
      const mockLogoutRecvDto: LogoutRecvDto = {
        message: 'User signed out successfully',
      };

      jest.spyOn(client, 'send').mockReturnValue(of(mockLogoutRecvDto));

      const result = await controller.logout(
        req as Request,
        res,
        mockLogoutDto,
      );

      expect(client.send).toHaveBeenCalledWith(
        { cmd: MsgAuthEnum.LOGOUT },
        { csrf_token: 'token', session_id_from_cookie: 'sessionId' },
      );
      expect(result).toEqual({ message: 'User signed out successfully' });
      expect(res.cookie).toHaveBeenCalledWith('incidents_session_id', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: expect.any(Date),
      });
    });

    it('should throw an error if session ID is missing', async () => {
      const req = {
        cookies: {},
      } as Request;
      const mockLogoutDto: LogoutDto = { csrf_token: 'token' };

      await expect(controller.logout(req, res, mockLogoutDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
