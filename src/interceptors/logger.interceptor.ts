import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLoggerService } from '../utils/logger.util';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = res;
        const contentLength = res.get('content-length');

        const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent}`;
        this.logger.log(logMessage);
      }),
    );
  }
}
