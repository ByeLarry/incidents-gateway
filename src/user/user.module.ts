import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AppLoggerService } from '../libs/helpers';
import { AuthServiceProvide } from '../libs/utils';

@Module({
  controllers: [UserController],
  providers: [AppLoggerService, AuthServiceProvide],
})
export class UserModule {}
