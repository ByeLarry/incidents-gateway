import { HttpException } from '@nestjs/common';

export function errorSwitch(message: string) {
  console.log(message);
  switch (message) {
    case '404':
      throw new HttpException('Not found', 404);
    case '409':
      throw new HttpException('Conflict', 409);
    case '403':
      throw new HttpException('Forbidden', 403);
    case '419':
      throw new HttpException('Session expired', 419);
    case '401':
      throw new HttpException('Unauthorized', 401);
    case '500':
      throw new HttpException('Internal server error', 500);
    case '400':
      throw new HttpException('Bad request', 400);
    case '422':
      throw new HttpException('Unprocessable entity', 422);
    case '429':
      throw new HttpException('Too many requests', 429);
  }
}
