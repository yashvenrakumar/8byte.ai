import dotenv from 'dotenv';

dotenv.config();

/** Always allow these origins (localhost + production frontend). */
const BUILTIN_ORIGINS = [
  'http://localhost:5173',
  'https://byteai-b065b.web.app',
] as const;

const clientOriginRaw = process.env.CLIENT_ORIGIN ?? '';
const fromEnv = clientOriginRaw.split(',').map((o) => o.trim()).filter(Boolean);
const allowedOrigins = [
  ...new Set([...BUILTIN_ORIGINS, ...fromEnv]),
];

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '5001', 10),
  clientOrigin: allowedOrigins.length === 1 ? allowedOrigins[0]! : allowedOrigins,
  allowedOrigins,
} as const;
