import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AppLoggerService } from '../libs/helpers';
import { AuthServiceProvide } from '../libs/utils';
import { STRATEGIES } from './strategies';
import { GUARDS } from '../libs/guards';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MicroserviceSenderService } from '../libs/services';
import { AdminController } from './admin.controller';
import { ResponseService } from './response.service';
import { ProvidersController } from './providers.controller';

@Module({
  controllers: [UserController, AdminController, ProvidersController],
  providers: [
    MicroserviceSenderService,
    AppLoggerService,
    ResponseService,
    AuthServiceProvide,
    ...STRATEGIES,
    ...GUARDS,
  ],
  imports: [HttpModule, ConfigModule],
})
export class UserModule {}
