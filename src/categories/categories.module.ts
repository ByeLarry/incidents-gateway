import { Module } from '@nestjs/common';
import { AuthServiceProvide, MarksServiceProvide } from '../libs/utils';
import { GUARDS } from '../libs/guards';
import { CategoriesController } from './categories.controller';
import { MicroserviceSenderService } from '../libs/services';
import { AppLoggerService } from '../libs/helpers';

@Module({
  controllers: [CategoriesController],
  providers: [
    MarksServiceProvide,
    AuthServiceProvide,
    ...GUARDS,
    MicroserviceSenderService,
    AppLoggerService
  ],
})
export class CategoriesModule {}
