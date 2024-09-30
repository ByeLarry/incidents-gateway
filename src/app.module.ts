import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerService } from './libs/helpers/logger';
import { MarksModule } from './marks/marks.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logger.interceptor';
import { UserModule } from './user/user.module';
import { AuthGuard } from './guards';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE_TAG, AuthServiceProvide } from './libs/utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    MarksModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      ttl: 3600,
    }),
  ],
  providers: [
    AuthServiceProvide,
    AppLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useFactory: (client: ClientProxy, refrector: Reflector) => {
        return new AuthGuard(client, refrector);
      },
      inject: [AUTH_SERVICE_TAG, Reflector],
    },
  ],
})
export class AppModule {}
