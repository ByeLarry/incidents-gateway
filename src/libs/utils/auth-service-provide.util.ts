import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AUTH_RMQ_QUEUE } from './consts.util';

export const AUTH_SERVICE_TAG = 'AUTH_SERVICE';

export const AuthServiceProvide = {
  provide: AUTH_SERVICE_TAG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`${configService.get('RMQ_HOST')}`],
        queue: AUTH_RMQ_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    }),
};
