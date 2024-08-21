import { Test, TestingModule } from '@nestjs/testing';
import { AuthMiddleware } from './auth.middleware';
import { Request, Response, NextFunction } from 'express';
import { of, throwError } from 'rxjs';
import { HttpStatusExtends } from '../utils/extendsHttpStatus.enum';
import { AUTH_SERVICE_TAG } from '../utils/auth.service.provide';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let client: any;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(async () => {
    client = {
      send: jest.fn().mockImplementation(() => of('mock response')),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        { provide: AUTH_SERVICE_TAG, useValue: client },
      ],
    }).compile();

    middleware = module.get<AuthMiddleware>(AuthMiddleware);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  const setupRequestAndClient = (
    sessionId: string | undefined,
    csrfToken: string | undefined,
    authResponse: string | Error,
  ) => {
    req = {
      cookies: { incidents_session_id: sessionId },
      body: { csrf_token: csrfToken },
    };

    client.send = jest
      .fn()
      .mockReturnValue(
        authResponse instanceof Error
          ? throwError(() => authResponse)
          : of(authResponse),
      );
  };

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it.each([
    [
      undefined,
      undefined,
      HttpStatusExtends.UNAUTHORIZED,
      'Session ID is missing',
    ],
    [
      'valid-session-id',
      undefined,
      HttpStatusExtends.FORBIDDEN,
      'CSRF token is missing',
    ],
    [
      'valid-session-id',
      'valid-csrf-token',
      HttpStatusExtends.SESSION_EXPIRED,
      'Session expired',
    ],
    [
      'valid-session-id',
      'valid-csrf-token',
      HttpStatusExtends.NOT_FOUND,
      'User not found',
    ],
    [
      'valid-session-id',
      'valid-csrf-token',
      HttpStatusExtends.INTERNAL_SERVER_ERROR,
      'Internal server error',
    ],
  ])(
    'should handle %s response',
    async (
      sessionId: string | undefined,
      csrfToken: string | undefined,
      statusCode: HttpStatusExtends,
      message: string,
    ) => {
      setupRequestAndClient(sessionId, csrfToken, statusCode.toString());
      await middleware.use(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({ message });
      expect(next).toHaveBeenCalled();
    },
  );

  it('should call next if authentication is successful', async () => {
    setupRequestAndClient(
      'valid-session-id',
      'valid-csrf-token',
      HttpStatusExtends.OK.toString(),
    );
    await middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should handle exception in sendAuthData', async () => {
    setupRequestAndClient(
      'valid-session-id',
      'valid-csrf-token',
      new Error('Error'),
    );
    await middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
