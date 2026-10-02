import { z } from 'zod';
import {
  UserRole,
  CourseStatus,
  LessonContentType,
  QuestionDifficulty,
  QuizShowAnswers,
  EnrollmentSource,
  DiscountType,
} from '@studyead/shared-types';

// -------------------------------------------------------------
// AUTH VALIDATORS
// -------------------------------------------------------------

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  phone: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional().nullable(),
  avatarUrl: z.string().url('URL inválida').optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Nova senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Nova senha deve conter pelo menos um número'),
});

// -------------------------------------------------------------
// COURSE VALIDATORS
// -------------------------------------------------------------

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(255),
  slug: z.string().min(3).max(255).optional(),
  description: z.string().max(500).optional().nullable(),
  longDescription: z.string().optional().nullable(),
  thumbnailUrl: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  priceCents: z.number().int().min(0, 'Preço não pode ser negativo').default(0),
  originalPriceCents: z.number().int().min(0).optional().nullable(),
  isFree: z.boolean().default(false),
  isPublished: z.boolean().default(false).optional(),
  status: z.nativeEnum(CourseStatus).optional(),
  category: z.string().max(100).optional().nullable(),
  tags: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
});

export const updateCourseSchema = createCourseSchema.partial();

// -------------------------------------------------------------
// MODULE VALIDATORS
// -------------------------------------------------------------

export const createModuleSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres').max(255),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

export const updateModuleSchema = createModuleSchema.partial();

// -------------------------------------------------------------
// LESSON VALIDATORS
// -------------------------------------------------------------

export const createLessonSchema = z.object({
  title: z.string().min(2, 'Título do aula é obrigatório').max(255),
  slug: z.string().min(2).max(255).optional(),
  description: z.string().optional().nullable(),
  contentText: z.string().optional().nullable(),
  durationMinutes: z.number().int().min(0).default(0),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
  isFreePreview: z.boolean().default(false),
});

export const updateLessonSchema = createLessonSchema.partial();

// -------------------------------------------------------------
// LESSON CONTENT VALIDATORS
// -------------------------------------------------------------

export const createLessonContentSchema = z.object({
  type: z.nativeEnum(LessonContentType),
  title: z.string().max(255).optional().nullable(),
  url: z.string().min(1, 'URL é obrigatória'),
  provider: z.string().max(50).optional().nullable(),
  providerId: z.string().max(255).optional().nullable(),
  fileSizeBytes: z.number().int().optional().nullable(),
  mimeType: z.string().max(100).optional().nullable(),
  durationSeconds: z.number().int().optional().nullable(),
  sortOrder: z.number().int().default(0),
  metadata: z.record(z.any()).optional().default({}),
  isDownloadable: z.boolean().default(false),
});

export const updateLessonContentSchema = createLessonContentSchema.partial();

// -------------------------------------------------------------
// QUESTION & OPTIONS VALIDATORS
// -------------------------------------------------------------

export const questionOptionSchema = z.object({
  label: z.string().length(1, 'Label deve ter 1 caractere (ex: A, B, C)'),
  text: z.string().min(1, 'Texto da alternativa é obrigatório'),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  isCorrect: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const createQuestionSchema = z.object({
  statement: z.string().min(5, 'Enunciado deve ter pelo menos 5 caracteres'),
  statementImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  explanation: z.string().optional().nullable(),
  subject: z.string().min(2, 'Disciplina é obrigatória'),
  topic: z.string().optional().nullable(),
  difficulty: z.nativeEnum(QuestionDifficulty).default(QuestionDifficulty.MEDIUM),
  tags: z.array(z.string()).default([]),
  options: z
    .array(questionOptionSchema)
    .min(2, 'A questão deve ter pelo menos 2 alternativas')
    .refine(
      (opts) => opts.filter((o) => o.isCorrect).length === 1,
      'Exatamente uma alternativa deve ser marcada como correta',
    ),
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const answerQuestionSchema = z.object({
  selectedOptionId: z.string().uuid('ID da alternativa inválido'),
});

// -------------------------------------------------------------
// QUIZ (SIMULADO) VALIDATORS
// -------------------------------------------------------------

export const createQuizSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  timeLimitMinutes: z.number().int().min(1).default(60),
  maxAttempts: z.number().int().min(0).default(1),
  shuffleQuestions: z.boolean().default(false),
  shuffleOptions: z.boolean().default(false),
  showAnswersAfter: z.nativeEnum(QuizShowAnswers).default(QuizShowAnswers.SUBMISSION),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
  isPublished: z.boolean().default(true).optional(),
  courseId: z.string().uuid().optional().nullable().or(z.literal('')),
  questionIds: z.array(z.string()).default([]),
});

export const updateQuizSchema = createQuizSchema.partial();

// -------------------------------------------------------------
// PROGRESS VALIDATOR
// -------------------------------------------------------------

export const updateLessonProgressSchema = z.object({
  watchedSeconds: z.number().int().min(0).optional(),
  completed: z.boolean().optional(),
});

// -------------------------------------------------------------
// CHECKOUT & PAYMENT VALIDATORS
// -------------------------------------------------------------

export const createCheckoutSchema = z.object({
  courseId: z.string().uuid('ID do curso inválido'),
  couponCode: z.string().optional().nullable(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Código do cupom é obrigatório'),
  courseId: z.string().uuid().optional().nullable(),
});

// Infer types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type CreateLessonContentInput = z.infer<typeof createLessonContentSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateLessonProgressInput = z.infer<typeof updateLessonProgressSchema>;
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
