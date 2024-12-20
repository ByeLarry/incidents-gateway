import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WebSocketMessageEnum } from '../libs/enums/websocket-message.enum';
import { createWebSocketConfig } from '../libs/utils';

@Injectable()
@WebSocketGateway(createWebSocketConfig())
export class MarksGateway {
  @WebSocketServer() server: Server;

  sendMessageToAll(message: any) {
    this.server.emit(WebSocketMessageEnum.MESSAGE, message);
  }

  emitMessageToAll(tag: string, message: any) {
    this.server.emit(tag, message);
  }
}
