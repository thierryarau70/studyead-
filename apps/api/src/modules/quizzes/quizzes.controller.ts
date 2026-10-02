import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtPayload, UserRole } from '@studyead/shared-types';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createQuizSchema, CreateQuizInput } from '@studyead/validators';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  /**
   * Admin: List all quizzes (including drafts)
   */
  @Get('all')
  async getAllQuizzes(@CurrentUser() user?: JwtPayload) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.quizzesService.getAllQuizzes(tenantId);
  }

  /**
   * List active published quizzes / simulados
   */
  @Get()
  async getQuizzes(@CurrentUser() user?: JwtPayload) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.quizzesService.getQuizzes(tenantId, user?.sub);
  }

  /**
   * Get single quiz details and questions for starting attempt
   */
  @Get(':id')
  async getQuizById(
    @Param('id') quizId: string,
    @CurrentUser() user?: JwtPayload,
  ) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.quizzesService.getQuizById(tenantId, quizId, user?.sub);
  }

  /**
   * Student: Submit quiz attempt answers
   */
  @Post(':id/submit')
  async submitQuizAttempt(
    @Param('id') quizId: string,
    @Body() body: { answers: Record<string, string>; timeSpentSeconds: number },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.quizzesService.submitQuizAttempt(
      user.tenantId,
      user.sub,
      quizId,
      body,
    );
  }

  /**
   * Admin: Create quiz
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Post()
  @UsePipes(new ZodValidationPipe(createQuizSchema))
  async createQuiz(
    @Body() body: CreateQuizInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.quizzesService.createQuiz(user.tenantId, body);
  }

  /**
   * Admin: Update quiz
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Put(':id')
  async updateQuiz(
    @Param('id') quizId: string,
    @Body() body: any,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.quizzesService.updateQuiz(user.tenantId, quizId, body);
  }

  /**
   * Admin: Delete quiz
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Delete(':id')
  async deleteQuiz(
    @Param('id') quizId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.quizzesService.deleteQuiz(user.tenantId, quizId);
  }
}
