import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { clientCors } from './libs/utils/client-cors.util';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { writeFileSync } from 'fs';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerDocumentBuilder } from './libs/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    clientCors([
      process.env.CLIENT_HOST || 'http://localhost',
      process.env.ADMIN_HOST || 'http://localhost:4200',
    ]),
  );
  app.use(cookieParser());
  app.use(compression({ level: 6, threshold: 1024 }));
  app.use(helmet());
  app.setGlobalPrefix('/api/');
  const swaggerConfig = SwaggerDocumentBuilder.build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
