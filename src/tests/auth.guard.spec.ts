import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE_TAG } from '../utils/authServiceProvide.util';
import { HttpStatusExtends } from '../utils/extendsHttpStatus.enum';
import { AuthGuard } from '../guards/auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let clientProxyMock: Partial<ClientProxy>;

  beforeEach(async () => {
    clientProxyMock = {
      send: jest.fn().mockReturnValue(of(undefined)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AUTH_SERVICE_TAG,
          useValue: clientProxyMock,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should return false if session ID is missing', async () => {
    const mockContext = createMockContext({
      cookies: {},
      body: { csrf_token: 'csrf_token' },
    });

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(false);
  });

  it('should return false if CSRF token is missing', async () => {
    const mockContext = createMockContext({
      cookies: { incidents_session_id: 'session_id' },
      body: {},
    });

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(false);
  });

  it('should return false if auth service returns an error', async () => {
    clientProxyMock.send = jest
      .fn()
      .mockReturnValue(of(HttpStatusExtends.UNAUTHORIZED.toString()));

    const mockContext = createMockContext({
      cookies: { incidents_session_id: 'session_id' },
      body: { csrf_token: 'csrf_token' },
    });

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(false);
  });

  it('should return true if session ID and CSRF token are valid', async () => {
    clientProxyMock.send = jest.fn().mockReturnValue(of(undefined));

    const mockContext = createMockContext({
      cookies: { incidents_session_id: 'session_id' },
      body: { csrf_token: 'csrf_token' },
    });

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should handle invalid auth service responses correctly', async () => {
    const invalidResponses = [
      HttpStatusExtends.NOT_FOUND.toString(),
      HttpStatusExtends.FORBIDDEN.toString(),
      HttpStatusExtends.SESSION_EXPIRED.toString(),
      HttpStatusExtends.INTERNAL_SERVER_ERROR.toString(),
    ];

    invalidResponses.forEach(async (response) => {
      clientProxyMock.send = jest.fn().mockReturnValue(of(response));

      const mockContext = createMockContext({
        cookies: { incidents_session_id: 'session_id' },
        body: { csrf_token: 'csrf_token' },
      });

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(false);
    });
  });

  function createMockContext(mockReqRes: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => mockReqRes,
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        }),
      }),
    } as unknown as ExecutionContext;
  }
});
