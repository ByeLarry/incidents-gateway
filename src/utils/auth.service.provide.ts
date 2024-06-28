import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const AuthServiceProvide = {
  provide: 'AUTH_SERVICE',
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
