import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketService implements OnModuleInit, OnModuleDestroy {
  private socket: Socket;
  private registeredHandlers = new Map<string, (data: any) => void>();

  onModuleInit() {
    this.socket = io(
      `http://${process.env.MARKS_HOST}:${process.env.MARKS_PORT}`,
    );
    this.socket.on('connect', () => {
      console.log('connected');
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
    if (!this.registeredHandlers.has(message)) {
      this.socket.on(message, cb);
      this.registeredHandlers.set(message, cb);
    }
  }

  off(message: string) {
    const handler = this.registeredHandlers.get(message);
    if (handler) {
      this.socket.off(message, handler);
      this.registeredHandlers.delete(message);
    }
  }
}
