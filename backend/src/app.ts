import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js';
import { swaggerDocument } from './config/swagger.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRoutes } from './routes/index.js';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: Array.isArray(config.clientOrigin)
    ? (origin, cb) => {
        if (origin && config.allowedOrigins.includes(origin)) {
          cb(null, true);
        } else if (!origin) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      }
    : config.clientOrigin,
}));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'Portfolio Dashboard API',
  explorer: true,
}));

app.use('/api', apiRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
