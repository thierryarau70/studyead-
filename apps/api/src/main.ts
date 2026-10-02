import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security middlewares
  app.use(helmet());
  const compressionFn = typeof compression === 'function' ? compression : (compression as any).default;
  if (typeof compressionFn === 'function') {
    app.use(compressionFn());
  }

  // CORS
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : [];

  // Patterns always allowed: localhost, vercel.app subdomains, onrender.com subdomains
  const allowedPatterns = [
    /^http:\/\/localhost(:\d+)?$/,
    /^http:\/\/127\.0\.0\.1(:\d+)?$/,
    /^https:\/\/[\w-]+\.vercel\.app$/,
    /^https:\/\/[\w-]+\.onrender\.com$/,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps)
      if (!origin) return callback(null, true);
      // Allow explicitly listed origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow pattern-matched origins
      if (allowedPatterns.some((re) => re.test(origin))) return callback(null, true);
      // Allow all in non-production
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      callback(new Error('Origem não permitida por CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
  });

  // Global prefix: /api/v1
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 StudyEAD API running at: http://localhost:${port}/api/v1`);
  logger.log(`🩺 Health check at: http://localhost:${port}/api/v1/health`);
}

bootstrap();
