import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateQuizInput } from '@studyead/validators';
import { QuizAttemptStatus } from '@studyead/shared-types';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  /**
   * List active published quizzes / simulados
   */
  async getQuizzes(tenantId: string, userId?: string) {
    const quizzes = await this.prisma.quiz.findMany({
      where: {
        tenantId,
        isPublished: true,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        quizQuestions: {
          select: { questionId: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { quizAttempts: true },
        },
      },
    });

    let userAttemptsMap: Record<string, any[]> = {};

    if (userId && quizzes.length > 0) {
      const attempts = await this.prisma.quizAttempt.findMany({
        where: {
          userId,
          quizId: { in: quizzes.map((q) => q.id) },
        },
        orderBy: { attemptNumber: 'desc' },
      });

      for (const att of attempts) {
        if (!userAttemptsMap[att.quizId]) {
          userAttemptsMap[att.quizId] = [];
        }
        userAttemptsMap[att.quizId].push(att);
      }
    }

    return quizzes.map((q) => ({
      ...q,
      attemptsCount: q._count.quizAttempts,
      questionIds: q.quizQuestions.map((qq) => qq.questionId),
      userAttempts: userAttemptsMap[q.id] || [],
    }));
  }

  /**
   * Get single quiz for taking an attempt
   */
  async getQuizById(tenantId: string, quizId: string, userId?: string) {
    const quiz = await this.prisma.quiz.findFirst({
      where: { id: quizId, tenantId, isPublished: true },
      include: {
        quizQuestions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            question: {
              include: {
                options: {
                  select: {
                    id: true,
                    label: true,
                    text: true,
                    imageUrl: true,
                    sortOrder: true,
                  },
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Simulado não encontrado');
    }

    let previousAttemptsCount = 0;
    if (userId) {
      previousAttemptsCount = await this.prisma.quizAttempt.count({
        where: { userId, quizId: quiz.id },
      });
    }

    return {
      ...quiz,
      previousAttemptsCount,
    };
  }

  /**
   * Submit completed quiz attempt
   */
  async submitQuizAttempt(
    tenantId: string,
    userId: string,
    quizId: string,
    body: { answers: Record<string, string>; timeSpentSeconds: number },
  ) {
    const quiz = await this.prisma.quiz.findFirst({
      where: { id: quizId, tenantId },
      include: {
        quizQuestions: {
          include: {
            question: {
              include: { options: true },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Simulado não encontrado');
    }

    const previousAttempts = await this.prisma.quizAttempt.count({
      where: { userId, quizId: quiz.id },
    });

    const attemptNumber = previousAttempts + 1;
    const userAnswers = body.answers || {};

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const totalQuestions = quiz.quizQuestions.length;

    const questionResults: any[] = [];

    for (const qq of quiz.quizQuestions) {
      const q = qq.question;
      const selectedOptionId = userAnswers[q.id];
      const correctOption = q.options.find((opt) => opt.isCorrect);

      let isCorrect: boolean | null = null;

      if (!selectedOptionId) {
        unansweredCount++;
      } else {
        isCorrect = selectedOptionId === correctOption?.id;
        if (isCorrect) correctCount++;
        else incorrectCount++;
      }

      questionResults.push({
        questionId: q.id,
        statement: q.statement,
        subject: q.subject,
        selectedOptionId,
        correctOptionId: correctOption?.id,
        correctOptionLabel: correctOption?.label,
        isCorrect,
        explanation: q.explanation,
      });
    }

    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    const quizAttempt = await this.prisma.quizAttempt.create({
      data: {
        tenantId,
        userId,
        quizId: quiz.id,
        attemptNumber,
        status: QuizAttemptStatus.COMPLETED,
        correctCount,
        incorrectCount,
        unansweredCount,
        totalQuestions,
        percentage: Number(percentage.toFixed(2)),
        timeSpentSeconds: body.timeSpentSeconds || 0,
        finishedAt: new Date(),
      },
    });

    return {
      quizAttempt,
      questionResults,
    };
  }

  /**
   * Admin: Create Quiz
   */
  async createQuiz(tenantId: string, input: any) {
    const rawQuestionIds = Array.isArray(input.questionIds) ? input.questionIds : [];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const questionIds = rawQuestionIds.filter((qId: string) => uuidRegex.test(qId));

    const validQuestions = questionIds.length > 0
      ? await this.prisma.question.findMany({
          where: { id: { in: questionIds } },
          select: { id: true },
        })
      : [];
    const validIds = new Set(validQuestions.map((q) => q.id));
    const toCreate = questionIds
      .filter((qId: string) => validIds.has(qId))
      .map((qId: string, idx: number) => ({
        questionId: qId,
        sortOrder: idx,
      }));

    const courseId = input.courseId && uuidRegex.test(input.courseId) ? input.courseId : null;

    return this.prisma.quiz.create({
      data: {
        tenantId,
        title: input.title,
        description: input.description,
        timeLimitMinutes: input.timeLimitMinutes || 60,
        maxAttempts: input.maxAttempts || 1,
        shuffleQuestions: Boolean(input.shuffleQuestions),
        shuffleOptions: Boolean(input.shuffleOptions),
        showAnswersAfter: input.showAnswersAfter || 'submission',
        startsAt: input.startsAt ? new Date(input.startsAt) : null,
        endsAt: input.endsAt ? new Date(input.endsAt) : null,
        courseId,
        questionCount: toCreate.length,
        isPublished: input.isPublished !== undefined ? Boolean(input.isPublished) : true,
        quizQuestions: {
          create: toCreate,
        },
      },
      include: {
        quizQuestions: true,
      },
    });
  }

  /**
   * Admin: List all quizzes including drafts
   */
  async getAllQuizzes(tenantId: string) {
    const quizzes = await this.prisma.quiz.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        quizQuestions: {
          select: { questionId: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { quizAttempts: true },
        },
      },
    });

    return quizzes.map((q) => ({
      ...q,
      attemptsCount: q._count.quizAttempts,
      questionIds: q.quizQuestions.map((qq) => qq.questionId),
    }));
  }

  /**
   * Admin: Update Quiz
   */
  async updateQuiz(tenantId: string, quizId: string, input: any) {
    const quiz = await this.prisma.quiz.findFirst({
      where: { id: quizId, tenantId },
    });

    if (!quiz) {
      throw new NotFoundException('Simulado não encontrado');
    }

    const data: any = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.timeLimitMinutes !== undefined) data.timeLimitMinutes = Number(input.timeLimitMinutes);
    if (input.maxAttempts !== undefined) data.maxAttempts = Number(input.maxAttempts);
    if (input.shuffleQuestions !== undefined) data.shuffleQuestions = Boolean(input.shuffleQuestions);
    if (input.shuffleOptions !== undefined) data.shuffleOptions = Boolean(input.shuffleOptions);
    if (input.showAnswersAfter !== undefined) data.showAnswersAfter = input.showAnswersAfter;
    if (input.isPublished !== undefined) data.isPublished = Boolean(input.isPublished);
    if (input.courseId !== undefined) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      data.courseId = input.courseId && uuidRegex.test(input.courseId) ? input.courseId : null;
    }

    if (Array.isArray(input.questionIds)) {
      await this.prisma.quizQuestion.deleteMany({
        where: { quizId },
      });
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validUuidQuestionIds = input.questionIds.filter((qId: string) => uuidRegex.test(qId));
      const validQuestions = validUuidQuestionIds.length > 0
        ? await this.prisma.question.findMany({
            where: { id: { in: validUuidQuestionIds } },
            select: { id: true },
          })
        : [];
      const validIds = new Set(validQuestions.map((q) => q.id));
      const toCreate = validUuidQuestionIds
        .filter((qId: string) => validIds.has(qId))
        .map((qId: string, idx: number) => ({
          quizId,
          questionId: qId,
          sortOrder: idx,
        }));
      if (toCreate.length > 0) {
        await this.prisma.quizQuestion.createMany({
          data: toCreate,
        });
      }
      data.questionCount = toCreate.length;
    }

    return this.prisma.quiz.update({
      where: { id: quizId },
      data,
      include: {
        quizQuestions: true,
      },
    });
  }

  /**
   * Admin: Delete Quiz
   */
  async deleteQuiz(tenantId: string, quizId: string) {
    const quiz = await this.prisma.quiz.findFirst({
      where: { id: quizId, tenantId },
    });

    if (!quiz) {
      throw new NotFoundException('Simulado não encontrado');
    }

    await this.prisma.quiz.delete({
      where: { id: quizId },
    });

    return { success: true, message: 'Simulado excluído com sucesso' };
  }
}

