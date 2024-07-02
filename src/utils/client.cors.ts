import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const clientCors: CorsOptions = {
  origin: process.env.CLIENT_HOST,
  methods: 'GET,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization, Accept',
  credentials: true,
};
