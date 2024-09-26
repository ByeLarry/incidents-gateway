/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { of, throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';
import { MsgAuthEnum } from '../libs/enums/msg.auth.enum';
import { UserController } from './user.controller';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { LogoutDto } from './dto/logout.dto';
import { LogoutRecvDto } from './dto/logout-recv.dto';
import { UserDto } from './dto/user.dto';
import { SESSION_ID_COOKIE_NAME } from '../libs/utils/consts.util';
import { AUTH_SERVICE_TAG } from '../libs/utils';

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
      status: jest.fn().mockReturnThis(),
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
      const mockUserRecvDto: UserDto = {
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
        MsgAuthEnum.SIGNUP,
        mockSignUpDto,
      );

      const { session_id, ...expectedResult } = mockUserRecvDto;
      expect(result).toEqual(expectedResult);

      expect(res.cookie).toHaveBeenCalledWith(
        SESSION_ID_COOKIE_NAME,
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
      const mockUserRecvDto: UserDto = {
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
        MsgAuthEnum.SIGNIN,
        mockSignInDto,
      );
      expect(result).toEqual(expectedResult);
      expect(res.cookie).toHaveBeenCalledWith(
        SESSION_ID_COOKIE_NAME,
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
      const mockUserRecvDto: UserDto = {
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

      expect(client.send).toHaveBeenCalledWith(MsgAuthEnum.ME, {
        session_id_from_cookie: 'sessionId',
      });
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

      expect(client.send).toHaveBeenCalledWith(MsgAuthEnum.LOGOUT, {
        csrf_token: 'token',
        session_id_from_cookie: 'sessionId',
      });
      expect(res.cookie).toHaveBeenCalledWith(SESSION_ID_COOKIE_NAME, '', {
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
