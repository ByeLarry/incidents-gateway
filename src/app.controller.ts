import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api')
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @Get('hello')
  async getHelloByName() {
    return this.client.send({ cmd: 'hello' }, 'test');
  }
}
