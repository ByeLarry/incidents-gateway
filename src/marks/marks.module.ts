import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MarkController } from './marks.controller';
import { MarksServiceProvide } from 'src/utils/marks.service.provide';
import { MarksGateway } from './marks.gateway';
import { RefreshMiddleware } from 'src/middlewares/refresh.middleware';
import { AuthServiceProvide } from 'src/utils/auth.service.provide';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  controllers: [MarkController],
  providers: [MarksServiceProvide, MarksGateway, AuthServiceProvide],
})
export class MarksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshMiddleware)
      .forRoutes(
        { path: 'api/marks/verify/true', method: RequestMethod.POST },
        { path: 'api/marks/verify/false', method: RequestMethod.POST },
        { path: 'api/marks/create', method: RequestMethod.POST },
      )
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/marks/verify/true', method: RequestMethod.POST },
        { path: 'api/marks/verify/false', method: RequestMethod.POST },
        { path: 'api/marks/create', method: RequestMethod.POST },
      );
  }
}
