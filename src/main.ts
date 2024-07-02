import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { clientCors } from './utils/client.cors';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(clientCors);
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Incidents')
    .setDescription('The incidents API description')
    .setVersion('1.0')
    .addCookieAuth('incidents_session_id')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document);
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
