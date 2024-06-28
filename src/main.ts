import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { clientCors } from './utils/client.cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(clientCors);
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
