import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtPayload, UserRole, QuestionDifficulty } from '@studyead/shared-types';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createQuestionSchema,
  answerQuestionSchema,
  CreateQuestionInput,
} from '@studyead/validators';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  /**
   * List questions with search & subject filters
   */
  @Public()
  @Get()
  async getQuestions(
    @Query('subject') subject?: string,
    @Query('topic') topic?: string,
    @Query('difficulty') difficulty?: QuestionDifficulty,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser() user?: JwtPayload,
  ) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.questionsService.getQuestions(
      tenantId,
      { subject, topic, difficulty, search, page, limit },
      user?.sub,
    );
  }

  /**
   * Student: Submit answer to a question
   */
  @Post(':id/answer')
  @UsePipes(new ZodValidationPipe(answerQuestionSchema))
  async answerQuestion(
    @Param('id') questionId: string,
    @Body() body: { selectedOptionId: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.questionsService.answerQuestion(
      user.tenantId,
      user.sub,
      questionId,
      body.selectedOptionId,
    );
  }

  /**
   * Admin: Create question
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Post()
  @UsePipes(new ZodValidationPipe(createQuestionSchema))
  async createQuestion(
    @Body() body: CreateQuestionInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.questionsService.createQuestion(user.tenantId, user.sub, body);
  }

  /**
   * Get question by ID
   */
  @Public()
  @Get(':id')
  async getQuestion(
    @Param('id') questionId: string,
    @CurrentUser() user?: JwtPayload,
  ) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.questionsService.getQuestionById(tenantId, questionId);
  }

  /**
   * Admin: Update question
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Put(':id')
  async updateQuestion(
    @Param('id') questionId: string,
    @Body() body: any,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.questionsService.updateQuestion(user.tenantId, questionId, body);
  }

  /**
   * Admin: Delete question
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Delete(':id')
  async deleteQuestion(
    @Param('id') questionId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.questionsService.deleteQuestion(user.tenantId, questionId);
  }
}

