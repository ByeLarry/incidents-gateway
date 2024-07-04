import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('api')
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private client: ClientProxy,
    @Inject('MARKS_SERVICE') private clientMarks: ClientProxy,
  ) {}

  @Get('hello')
  async getHelloByName() {
    const responseMarks = await firstValueFrom(
      this.clientMarks.send({ cmd: 'hello' }, 'test'),
    );
    console.log(responseMarks);
    return this.client.send({ cmd: 'hello' }, 'test');
  }
}
