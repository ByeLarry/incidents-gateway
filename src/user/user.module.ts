import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { AppLoggerService } from '../utils/logger.util';
import { RefreshMiddleware } from '../middlewares/refresh.middleware';
import { AuthServiceProvide } from '../utils/authServiceProvide.util';

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
