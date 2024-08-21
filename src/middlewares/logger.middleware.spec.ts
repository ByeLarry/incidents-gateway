import { LoggingMiddleware } from './logger.middleware';
import { AppLoggerService } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

describe('LoggingMiddleware', () => {
  let loggingMiddleware: LoggingMiddleware;
  let mockLogger: AppLoggerService;

  beforeEach(() => {
    mockLogger = { log: jest.fn() } as unknown as AppLoggerService;
    loggingMiddleware = new LoggingMiddleware(mockLogger);
  });

  const createMockRequest = (
    method: string,
    url: string,
    userAgent?: string,
  ): Request =>
    ({
      method,
      originalUrl: url,
      get: jest.fn().mockReturnValue(userAgent || ''),
    }) as unknown as Request;

  const createMockResponse = (
    statusCode: number,
    contentLength?: string,
  ): Response =>
    ({
      statusCode,
      get: jest.fn().mockReturnValue(contentLength || null),
      on: jest.fn((event, callback) => {
        if (event === 'finish') callback();
      }),
    }) as unknown as Response;

  const createMockNext = (): NextFunction => jest.fn();

  it('should be defined', () => {
    expect(loggingMiddleware).toBeDefined();
  });

  it('should call logger.log on response finish', () => {
    const req = createMockRequest('GET', '/test-url', 'Mozilla/5.0');
    const res = createMockResponse(200, '123');
    const next = createMockNext();

    loggingMiddleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(mockLogger.log).toHaveBeenCalledWith(
      'GET /test-url 200 123 - Mozilla/5.0',
    );
  });

  it('should handle missing user-agent and content-length', () => {
    const req = createMockRequest('POST', '/another-url');
    const res = createMockResponse(404);
    const next = createMockNext();

    loggingMiddleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(mockLogger.log).toHaveBeenCalledWith(
      'POST /another-url 404 null - ',
    );
  });
});
