import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MarkController } from './marks.controller';
import { MarksServiceProvide } from '../utils/marksServiceProvide.util';
import { MarksGateway } from './marks.gateway';
import { RefreshMiddleware } from '../middlewares/refresh.middleware';
import { AuthServiceProvide } from '../utils/authServiceProvide.util';

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
      );
  }
}
