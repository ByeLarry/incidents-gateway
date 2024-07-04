import { Module } from '@nestjs/common';
import { MarksGateway } from './marks.gateway';
import { SocketSerivice } from 'src/services/socket.service';

@Module({
  providers: [MarksGateway, SocketSerivice],
})
export class MarksModule {}
