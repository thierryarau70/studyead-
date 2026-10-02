import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getApiInfo() {
    return {
      name: 'StudyEAD API',
      version: '1.0.0',
      status: 'online',
      description: 'API NestJS da Plataforma EAD com PostgreSQL',
      endpoints: {
        health: '/api/v1/health',
        auth: '/api/v1/auth/login',
        courses: '/api/v1/courses',
        questions: '/api/v1/questions',
        quizzes: '/api/v1/quizzes',
      },
    };
  }
}
