import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';
import { AppLoggerService } from 'src/utils/logger';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [
    AppLoggerService,
    {
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
    },
  ],
})
export class UserModule {}
