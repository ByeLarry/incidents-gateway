import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super();
  }
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    if (req.query['error']) {
      res.redirect(`${this.configService.get('GOOGLE_FAILURE_REDIRECT_URL')}`);
    }
    return user;
  }
}
