import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE_TAG } from '../utils/auth.service.provide';
import { HttpStatusExtends } from '../utils/extendsHttpStatus.enum';

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
