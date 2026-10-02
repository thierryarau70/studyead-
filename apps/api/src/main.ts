import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';
import * as bcrypt from 'bcrypt';

async function runSelfHealing(app: any, logger: Logger) {
  try {
    const prisma = app.get(PrismaService);
    if (!prisma) return;

    const defaultTenantId = '00000000-0000-0000-0000-000000000001';
    const passwordHash = await bcrypt.hash('Admin@123456', 10);

    // 1. Create/Ensure new default admin: coordenacao@cursinhoalpha.com.br
    const newAdminEmail = 'coordenacao@cursinhoalpha.com.br';
    await prisma.user.upsert({
      where: {
        tenantId_email: {
          tenantId: defaultTenantId,
          email: newAdminEmail,
        },
      },
      update: {
        role: 'admin',
        isActive: true,
        passwordHash,
      },
      create: {
        tenantId: defaultTenantId,
        email: newAdminEmail,
        name: 'Coordenação Geral Alpha',
        passwordHash,
        role: 'admin',
        isActive: true,
        emailVerifiedAt: new Date(),
      },
    });
    logger.log(`🛡️  Default admin (${newAdminEmail}) verified and active`);

    // 2. Guarantee all admin accounts are active and have admin role
    const adminResult = await prisma.user.updateMany({
      where: {
        OR: [
          { email: 'coordenacao@cursinhoalpha.com.br' },
          { email: 'admin@cursinhoalpha.com.br' },
          { email: 'diretoria@cursinhoalpha.com.br' },
          { role: { in: ['admin', 'super_admin'] } },
        ],
      },
      data: {
        role: 'admin',
        isActive: true,
      },
    });
    if (adminResult.count > 0) {
      logger.log(`🛡️  Admin accounts active verified (${adminResult.count} accounts)`);
    }

    // Guarantee default demo student is active and enrolled into published courses
    const demoStudent = await prisma.user.findFirst({
      where: { email: 'aluno@cursinhoalpha.com.br' },
    });
    if (demoStudent) {
      if (!demoStudent.isActive) {
        await prisma.user.update({
          where: { id: demoStudent.id },
          data: { isActive: true },
        });
      }
      const publishedCourses = await prisma.course.findMany({
        where: { tenantId: demoStudent.tenantId, isPublished: true },
        select: { id: true },
      });
      for (const course of publishedCourses) {
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: demoStudent.id,
              courseId: course.id,
            },
          },
          update: { status: 'active' },
          create: {
            tenantId: demoStudent.tenantId,
            userId: demoStudent.id,
            courseId: course.id,
            source: 'admin',
            status: 'active',
          },
        }).catch(() => {});
      }
      logger.log(`🎓 Demo student enrollments synced with published courses`);
    }
  } catch (err: any) {
    logger.warn(`Self-healing routine skipped: ${err?.message}`);
  }
}

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

  // Run startup self-healing
  await runSelfHealing(app, logger);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 StudyEAD API running at: http://localhost:${port}/api/v1`);
  logger.log(`🩺 Health check at: http://localhost:${port}/api/v1/health`);
}

bootstrap();
