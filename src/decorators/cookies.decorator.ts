import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return key ? req.cookies[key] : req.cookies;
  },
);
