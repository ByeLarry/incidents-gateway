import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MARKS_RMQ_QUEUE } from './consts.util';

export const MARKS_SERVICE_TAG = 'MARKS_SERVICE';

export const MarksServiceProvide = {
  provide: MARKS_SERVICE_TAG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`${configService.get('RMQ_HOST')}`],
        queue: MARKS_RMQ_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    }),
};
