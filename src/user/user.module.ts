import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AppLoggerService } from '../libs/helpers';
import { AuthServiceProvide } from '../libs/utils';
import { STRATEGIES } from './strategies';
import { GUARDS } from '../guards';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UserController],
  providers: [AppLoggerService, AuthServiceProvide, ...STRATEGIES, ...GUARDS],
  imports: [HttpModule, ConfigModule],
})
export class UserModule {}
