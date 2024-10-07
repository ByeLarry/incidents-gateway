import { Module } from '@nestjs/common';
import { MarkController } from './marks.controller';
import { AuthServiceProvide, MarksServiceProvide } from '../libs/utils';
import { MarksGateway } from './marks.gateway';
import { GUARDS } from '../guards';

@Module({
  controllers: [MarkController],
  providers: [MarksServiceProvide, MarksGateway, AuthServiceProvide, ...GUARDS],
})
export class MarksModule {}
