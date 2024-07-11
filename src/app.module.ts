import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AppLoggerService } from './utils/logger';
import { MarksModule } from './marks/marks.module';
import { LoggingMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, MarksModule],
  providers: [AppLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
