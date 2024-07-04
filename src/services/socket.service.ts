import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketSerivice implements OnModuleInit, OnModuleDestroy {
  private socket: Socket;

  onModuleInit() {
    this.socket = io(
      `http://${process.env.MARKS_HOST}:${process.env.MARKS_PORT}`,
    );
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('test', (data) => {
      console.log(data);
    });
    this.socket.on('disconnect', () => {
      console.log('disconnected');
    });
  }

  onModuleDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  sendMessage(message: string, data: any) {
    this.socket.emit(message, data);
  }

  on(message: string, cb: (data: any) => void) {
    return this.socket.on(message, cb);
  }
}
