import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const clientCors = (origin: string): CorsOptions => ({
  origin,
  methods: 'GET,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization, Accept',
  credentials: true,
});
