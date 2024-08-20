import { Injectable } from '@nestjs/common';
import { Logger, format, createLogger } from 'winston';

import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class AppLoggerService {
  private readonly logger: Logger;
  private readonly fileConfig: DailyRotateFile = new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      }),
    ),
  });

  constructor() {
    this.logger = createLogger({
      transports: [this.fileConfig],
    });
  }

  log(message: string) {
    this.logger.log('info', message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
