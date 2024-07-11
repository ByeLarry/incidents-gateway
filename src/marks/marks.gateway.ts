import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: { origin: 'http://localhost' } })
export class MarksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private clients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    this.clients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
  }

  sendMessageToAll(message: any) {
    this.server.emit('message', message);
  }

  sendMessageToUser(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client) {
      client.emit('message', message);
    }
  }

  emitMessageToUser(clientId: string, tag: string, message: any) {
    const client = this.clients.get(clientId);
    if (client) {
      client.emit(tag, message);
    }
  }

  emitMessageToAll(tag: string, message: any) {
    this.server.emit(tag, message);
  }
}
