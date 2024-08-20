import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const AUTH_SERVICE_TAG = 'AUTH_SERVICE';

export const AuthServiceProvide = {
  provide: AUTH_SERVICE_TAG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: configService.get('AUTH_HOST'),
        port: configService.get('AUTH_PORT'),
      },
    }),
};
