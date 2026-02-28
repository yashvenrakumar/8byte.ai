import dotenv from 'dotenv';

dotenv.config();

const defaultOrigins = 'http://localhost:5173,https://byteai-b065b.web.app';
const clientOriginRaw = process.env.CLIENT_ORIGIN ?? defaultOrigins;
const allowedOrigins = clientOriginRaw.split(',').map((o) => o.trim()).filter(Boolean);

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '5001', 10),
  clientOrigin: allowedOrigins.length === 1 ? allowedOrigins[0]! : allowedOrigins,
  allowedOrigins,
} as const;
