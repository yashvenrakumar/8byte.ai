import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '5001', 10),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
} as const;
