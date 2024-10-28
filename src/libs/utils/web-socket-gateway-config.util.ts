import { ConfigService } from '@nestjs/config';

export const createWebSocketConfig = (configService: ConfigService) => {
  return {
    cors: {
      origin: [
        configService.get<string>('CLIENT_HOST'),
        configService.get<string>('ADMIN_HOST'),
      ],
    },
  };
};
