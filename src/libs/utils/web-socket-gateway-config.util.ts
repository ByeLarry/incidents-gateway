import * as dotenv from 'dotenv';

dotenv.config();

export const createWebSocketConfig = () => {
  const clientHost = process.env.CLIENT_HOST;
  const adminHost = process.env.ADMIN_HOST;

  return {
    cors: {
      origin: [clientHost, adminHost],
    },
  };
};
