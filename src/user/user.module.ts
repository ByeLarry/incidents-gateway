import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { AppLoggerService } from '../utils/logger';
import { RefreshMiddleware } from '../middlewares/refresh.middleware';
import { AuthServiceProvide } from '../utils/auth.service.provide';

@Module({
  controllers: [UserController],
  providers: [AppLoggerService, AuthServiceProvide],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshMiddleware)
      .forRoutes({ path: 'api/auth/me', method: RequestMethod.ALL });
  }
}
