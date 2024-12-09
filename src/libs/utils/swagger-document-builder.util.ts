import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerDocumentBuilder = new DocumentBuilder()
  .setTitle('Incidents API')
  .setVersion('0.1.1')
  .addBearerAuth({in: 'header', type: 'http', scheme: 'bearer', bearerFormat: 'JWT'})
