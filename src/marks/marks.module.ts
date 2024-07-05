import { Module } from '@nestjs/common';
import { MarksGateway } from './marks.gateway';
import { SocketService } from 'src/services/socket.service';
import { MarkController } from './marks.controller';

@Module({
  controllers: [MarkController],
  providers: [MarksGateway, SocketService],
})
export class MarksModule {}
