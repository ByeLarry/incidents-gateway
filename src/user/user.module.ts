import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { RefreshMiddleware } from '../middlewares';
import { AppLoggerService } from '../libs/helpers';
import { AuthServiceProvide } from '../libs/utils';

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
