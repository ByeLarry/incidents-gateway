import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const MARKS_SERVICE_TAG = 'MARKS_SERVICE';

export const MarksServiceProvide = {
  provide: MARKS_SERVICE_TAG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: configService.get('MARKS_HOST'),
        port: configService.get('MARKS_PORT'),
      },
    }),
};
