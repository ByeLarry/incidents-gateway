import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { AppLoggerService } from 'src/utils/logger';
import { RefreshMiddleware } from 'src/middlewares/refresh.middleware';
import { AuthServiceProvide } from 'src/utils/auth.service.provide';

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
