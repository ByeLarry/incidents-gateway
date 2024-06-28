import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppLoggerService } from 'src/utils/logger';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { firstValueFrom } from 'rxjs';

@Controller('api/auth')
export class UserController {
  constructor(
    @Inject('AUTH_SERVICE') private client: ClientProxy,
    private readonly logger: AppLoggerService,
  ) {}

  @Post('signup')
  async signup(@Body() data: SignUpDto) {
    console.log(data);
    this.logger.log(JSON.stringify(data));
    const result = await firstValueFrom(
      this.client.send({ cmd: 'signup' }, data),
    );
    switch (result) {
      case '409':
        return 'User already exists';
      case '500':
        return 'Error saving user';
      default:
        return result;
    }
  }

  @Post('signin')
  signin(@Body() data: SignInDto) {
    console.log(data);
    this.logger.log(JSON.stringify(data));
    return this.client.send({ cmd: 'signin' }, data);
  }
}
