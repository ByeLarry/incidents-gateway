import { LoggingInterceptor } from './logger.interceptor';
import { AppLoggerService } from '../utils/logger';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let loggingInterceptor: LoggingInterceptor;
  let mockLogger: AppLoggerService;

  beforeEach(() => {
    mockLogger = { log: jest.fn() } as unknown as AppLoggerService;
    loggingInterceptor = new LoggingInterceptor(mockLogger);
  });

  const createMockExecutionContext = (
    method: string,
    url: string,
    userAgent?: string,
    statusCode?: number,
    contentLength?: string,
  ): ExecutionContext => {
    const req = {
      method,
      originalUrl: url,
      get: jest.fn().mockReturnValue(userAgent || ''),
    } as unknown as Request;

    const res = {
      statusCode: statusCode || 200,
      get: jest.fn().mockReturnValue(contentLength || null),
    } as unknown as Response;

    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(req),
        getResponse: jest.fn().mockReturnValue(res),
      }),
    } as unknown as ExecutionContext;
  };

  const createMockCallHandler = (): CallHandler => {
    return {
      handle: jest.fn().mockReturnValue(of(null)),
    } as unknown as CallHandler;
  };

  it('should be defined', () => {
    expect(loggingInterceptor).toBeDefined();
  });

  it('should call logger.log on response finish', () => {
    const context = createMockExecutionContext(
      'GET',
      '/test-url',
      'Mozilla/5.0',
      200,
      '123',
    );
    const next = createMockCallHandler();

    loggingInterceptor.intercept(context, next).subscribe();

    expect(mockLogger.log).toHaveBeenCalledWith(
      'GET /test-url 200 123 - Mozilla/5.0',
    );
  });

  it('should handle missing user-agent and content-length', () => {
    const context = createMockExecutionContext('POST', '/another-url');
    const next = createMockCallHandler();

    loggingInterceptor.intercept(context, next).subscribe();

    expect(mockLogger.log).toHaveBeenCalledWith(
      'POST /another-url 200 null - ',
    );
  });
});
