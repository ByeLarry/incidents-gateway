import { Test, TestingModule } from '@nestjs/testing';
import { RefreshMiddleware } from './refresh.middleware';
import { Request, Response, NextFunction } from 'express';
import { of, throwError } from 'rxjs';
import { RefreshRecvDto } from '../user/dto/refresh-recv.dto';
import { AUTH_SERVICE_TAG } from '../utils/auth.service.provide';
import { HttpStatusExtends } from '../utils/extendsHttpStatus.enum';

describe('RefreshMiddleware', () => {
  let middleware: RefreshMiddleware;
  let client: any;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(async () => {
    client = {
      send: jest
        .fn()
        .mockImplementation(() => of({ session_id: 'new-session-id' })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshMiddleware,
        { provide: AUTH_SERVICE_TAG, useValue: client },
      ],
    }).compile();

    middleware = module.get<RefreshMiddleware>(RefreshMiddleware);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    next = jest.fn();
  });

  const setupRequestAndClient = (
    sessionId: string | undefined,
    refreshResponse: RefreshRecvDto | string | Error,
  ) => {
    req = {
      cookies: { incidents_session_id: sessionId },
    };

    client.send = jest
      .fn()
      .mockReturnValue(
        refreshResponse instanceof Error
          ? throwError(() => refreshResponse)
          : of(refreshResponse),
      );
  };

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should return error if session ID is missing', async () => {
    setupRequestAndClient(undefined, 'mock response');
    await middleware.use(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatusExtends.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Session ID is missing' });
    expect(next).toHaveBeenCalled();
  });

  it('should handle refresh errors', async () => {
    setupRequestAndClient(
      'valid-session-id',
      HttpStatusExtends.SESSION_EXPIRED.toString(),
    );
    await middleware.use(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatusExtends.SESSION_EXPIRED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Session expired' });
    expect(next).toHaveBeenCalled();
  });

  it('should set cookie and call next if refresh is successful', async () => {
    setupRequestAndClient('valid-session-id', { session_id: 'new-session-id' });
    await middleware.use(req as Request, res as Response, next);
    expect(res.cookie).toHaveBeenCalledWith(
      'incidents_session_id',
      'new-session-id',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: expect.any(Date),
      },
    );
    expect(next).toHaveBeenCalled();
  });

  it('should handle exceptions during refresh', async () => {
    setupRequestAndClient('valid-session-id', new Error('Error'));
    await middleware.use(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(
      HttpStatusExtends.INTERNAL_SERVER_ERROR,
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    expect(next).toHaveBeenCalled();
  });
});
