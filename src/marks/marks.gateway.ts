import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WebSocketMessageEnum } from '../libs/enums/websocket-message.enum';

@Injectable()
@WebSocketGateway({
  cors: { origin: ['http://localhost', 'http://localhost:4200'] },
})
export class MarksGateway {
  @WebSocketServer() server: Server;

  sendMessageToAll(message: any) {
    this.server.emit(WebSocketMessageEnum.MESSAGE, message);
  }

  emitMessageToAll(tag: string, message: any) {
    this.server.emit(tag, message);
  }
}
