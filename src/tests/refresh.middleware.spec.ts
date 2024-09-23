import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';
import { of, throwError } from 'rxjs';
import { RefreshMiddleware } from '../middlewares/refresh.middleware';
import { AUTH_SERVICE_TAG } from '../utils/authServiceProvide.util';
import { RefreshRecvDto } from '../user/dto/refreshRecv.dto';
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

  it('should return internal server error request', async () => {
    setupRequestAndClient('valid-session-id', new Error('Internal error'));
    await middleware.use(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(
      HttpStatusExtends.INTERNAL_SERVER_ERROR,
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    expect(next).toHaveBeenCalled();
  });

  it('should continue without error if session ID is invalid', async () => {
    setupRequestAndClient('invalid-session-id', 'mock response');
    await middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should handle refresh with a different valid session ID', async () => {
    setupRequestAndClient('valid-session-id-2', {
      session_id: 'new-session-id-2',
    });
    await middleware.use(req as Request, res as Response, next);
    expect(res.cookie).toHaveBeenCalledWith(
      'incidents_session_id',
      'new-session-id-2',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: expect.any(Date),
      },
    );
    expect(next).toHaveBeenCalled();
  });

  it('should return unauthorized if session ID is empty', async () => {
    setupRequestAndClient('', 'mock response');
    await middleware.use(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatusExtends.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Session ID is missing' });
    expect(next).toHaveBeenCalled();
  });

  it('should map unauthorized error correctly', async () => {
    setupRequestAndClient(
      'valid-session-id',
      HttpStatusExtends.UNAUTHORIZED.toString(),
    );
    await middleware.use(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatusExtends.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).toHaveBeenCalled();
  });
});
