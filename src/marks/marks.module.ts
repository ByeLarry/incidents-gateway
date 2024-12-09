import { Module } from '@nestjs/common';
import { MarkController } from './marks.controller';
import {
  AuthServiceProvide,
  MarksServiceProvide,
  SearchServiceProvide,
} from '../libs/utils';
import { MarksGateway } from './marks.gateway';
import { GUARDS } from '../libs/guards';
import { MicroserviceSenderService } from '../libs/services';
import { AppLoggerService } from '../libs/helpers';

@Module({
  controllers: [MarkController],
  providers: [
    MarksServiceProvide,
    SearchServiceProvide,
    MarksGateway,
    AuthServiceProvide,
    ...GUARDS,
    MicroserviceSenderService,
    AppLoggerService,
  ],
})
export class MarksModule {}
