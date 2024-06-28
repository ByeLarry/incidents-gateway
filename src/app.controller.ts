import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api')
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @Get('hello/test/test2')
  getHelloByName(@Param('name') name = 'there') {
    return this.client.send({ cmd: 'hello' }, name);
  }
}
