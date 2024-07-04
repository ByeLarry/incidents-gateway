import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthServiceProvide } from './utils/auth.service.provide';
import { UserModule } from './user/user.module';
import { LoggingMiddleware } from './utils/logger.middleware';
import { AppLoggerService } from './utils/logger';
import { MarksServiceProvide } from './utils/marks.service.provide';
import { MarksModule } from './marks/marks.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, MarksModule],
  controllers: [AppController],
  providers: [
    AppService,
    AuthServiceProvide,
    AppLoggerService,
    MarksServiceProvide,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
