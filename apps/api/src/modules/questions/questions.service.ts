import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateQuestionInput } from '@studyead/validators';
import { QuestionDifficulty } from '@studyead/shared-types';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Filter and list questions for practice bank
   */
  async getQuestions(
    tenantId: string,
    query: {
      subject?: string;
      topic?: string;
      difficulty?: QuestionDifficulty;
      search?: string;
      page?: number;
      limit?: number;
    } = {},
    userId?: string,
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
      isActive: true,
    };

    if (query.subject) {
      where.subject = { equals: query.subject, mode: 'insensitive' };
    }

    if (query.topic) {
      where.topic = { contains: query.topic, mode: 'insensitive' };
    }

    if (query.difficulty) {
      where.difficulty = query.difficulty;
    }

    if (query.search) {
      where.OR = [
        { statement: { contains: query.search, mode: 'insensitive' } },
        { explanation: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          options: {
            select: {
              id: true,
              label: true,
              text: true,
              imageUrl: true,
              isCorrect: true,
              sortOrder: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      this.prisma.question.count({ where }),
    ]);

    // Fetch user previous attempts if logged in
    let userAttemptsMap: Record<string, { selectedOptionId: string; isCorrect: boolean; answeredAt: Date }> = {};

    if (userId && questions.length > 0) {
      const attempts = await this.prisma.questionAttempt.findMany({
        where: {
          userId,
          questionId: { in: questions.map((q) => q.id) },
        },
        orderBy: { answeredAt: 'desc' },
      });

      for (const att of attempts) {
        if (!userAttemptsMap[att.questionId] && att.selectedOptionId) {
          userAttemptsMap[att.questionId] = {
            selectedOptionId: att.selectedOptionId,
            isCorrect: att.isCorrect ?? false,
            answeredAt: att.answeredAt,
          };
        }
      }
    }

    return {
      items: questions.map((q) => ({
        ...q,
        userAttempt: userAttemptsMap[q.id] || null,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Submit student answer to a standalone question
   */
  async answerQuestion(
    tenantId: string,
    userId: string,
    questionId: string,
    selectedOptionId: string,
  ) {
    const question = await this.prisma.question.findFirst({
      where: { id: questionId, tenantId, isActive: true },
      include: {
        options: true,
      },
    });

    if (!question) {
      throw new NotFoundException('Questão não encontrada');
    }

    const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);

    if (!selectedOption) {
      throw new BadRequestException('Alternativa selecionada não pertence a esta questão');
    }

    const correctOption = question.options.find((opt) => opt.isCorrect);
    const isCorrect = selectedOption.isCorrect === true;

    // Record question attempt
    const attempt = await this.prisma.questionAttempt.create({
      data: {
        tenantId,
        userId,
        questionId,
        selectedOptionId,
        isCorrect,
      },
    });

    return {
      isCorrect,
      selectedOptionId,
      correctOptionId: correctOption?.id,
      correctOptionLabel: correctOption?.label,
      explanation: question.explanation,
      attemptId: attempt.id,
    };
  }

  /**
   * Admin: Create question
   */
  async createQuestion(tenantId: string, userId: string, input: CreateQuestionInput) {
    return this.prisma.question.create({
      data: {
        tenantId,
        createdBy: userId,
        statement: input.statement,
        statementImageUrl: input.statementImageUrl,
        explanation: input.explanation,
        subject: input.subject,
        topic: input.topic,
        difficulty: input.difficulty,
        tags: input.tags,
        options: {
          create: input.options.map((opt) => ({
            label: opt.label,
            text: opt.text,
            imageUrl: opt.imageUrl,
            isCorrect: opt.isCorrect,
            sortOrder: opt.sortOrder,
          })),
        },
      },
      include: {
        options: true,
      },
    });
  }

  /**
   * Get single question by ID
   */
  async getQuestionById(tenantId: string, questionId: string) {
    const question = await this.prisma.question.findFirst({
      where: { id: questionId, tenantId },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Questão não encontrada');
    }

    return question;
  }

  /**
   * Admin: Update question
   */
  async updateQuestion(tenantId: string, questionId: string, input: any) {
    const question = await this.prisma.question.findFirst({
      where: { id: questionId, tenantId },
    });

    if (!question) {
      throw new NotFoundException('Questão não encontrada');
    }

    const data: any = {};
    if (input.statement !== undefined) data.statement = input.statement;
    if (input.statementImageUrl !== undefined) data.statementImageUrl = input.statementImageUrl;
    if (input.explanation !== undefined) data.explanation = input.explanation;
    if (input.subject !== undefined) data.subject = input.subject;
    if (input.topic !== undefined) data.topic = input.topic;
    if (input.difficulty !== undefined) data.difficulty = input.difficulty;
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.isActive !== undefined) data.isActive = Boolean(input.isActive);

    // Se novas opções forem fornecidas, atualiza
    if (Array.isArray(input.options) && input.options.length > 0) {
      await this.prisma.questionOption.deleteMany({
        where: { questionId },
      });
      await this.prisma.questionOption.createMany({
        data: input.options.map((opt: any, idx: number) => ({
          questionId,
          label: opt.label || String.fromCharCode(65 + idx),
          text: opt.text,
          imageUrl: opt.imageUrl,
          isCorrect: Boolean(opt.isCorrect),
          sortOrder: opt.sortOrder !== undefined ? Number(opt.sortOrder) : idx,
        })),
      });
    }

    return this.prisma.question.update({
      where: { id: questionId },
      data,
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  /**
   * Admin: Delete question
   */
  async deleteQuestion(tenantId: string, questionId: string) {
    const question = await this.prisma.question.findFirst({
      where: { id: questionId, tenantId },
    });

    if (!question) {
      throw new NotFoundException('Questão não encontrada');
    }

    await this.prisma.question.delete({
      where: { id: questionId },
    });

    return { success: true, message: 'Questão excluída com sucesso' };
  }
}

