import { Module } from '@nestjs/common';
import { MarkController } from './marks.controller';
import { AuthServiceProvide, MarksServiceProvide } from '../libs/utils';
import { MarksGateway } from './marks.gateway';

@Module({
  controllers: [MarkController],
  providers: [MarksServiceProvide, MarksGateway, AuthServiceProvide],
})
export class MarksModule {}
