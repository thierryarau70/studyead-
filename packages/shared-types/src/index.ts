// -------------------------------------------------------------
// ENUMS
// -------------------------------------------------------------

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher',
  MODERATOR = 'moderator',
  SUPPORT = 'support',
  SUPER_ADMIN = 'super_admin',
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum LessonContentType {
  VIDEO = 'video',
  PDF = 'pdf',
  FILE = 'file',
  LINK = 'link',
  EMBED = 'embed',
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum QuizShowAnswers {
  SUBMISSION = 'submission',
  DEADLINE = 'deadline',
  NEVER = 'never',
}

export enum QuizAttemptStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  TIMED_OUT = 'timed_out',
}

export enum EnrollmentStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export enum EnrollmentSource {
  PURCHASE = 'purchase',
  ADMIN = 'admin',
  COUPON = 'coupon',
  COURTESY = 'courtesy',
  IMPORT = 'import',
}

export enum LessonProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  REFUNDED = 'refunded',
  CHARGEBACK = 'chargeback',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

// -------------------------------------------------------------
// DOMAIN MODELS & INTERFACES
// -------------------------------------------------------------

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TenantSettings {
  id: string;
  tenantId: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  siteTitle: string;
  siteDescription?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  socialLinks?: Record<string, string>;
  customCss?: string | null;
  paymentGateway: string;
}

export interface User {
  id: string;
  tenantId: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  emailVerifiedAt?: Date | string | null;
  lastLoginAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Course {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  description?: string | null;
  longDescription?: string | null;
  thumbnailUrl?: string | null;
  priceCents: number;
  originalPriceCents?: number | null;
  isPublished: boolean;
  isFree: boolean;
  status: CourseStatus;
  totalDurationMinutes: number;
  totalLessons: number;
  category?: string | null;
  tags: string[];
  sortOrder: number;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CourseModule {
  id: string;
  tenantId: string;
  courseId: string;
  title: string;
  description?: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Lesson {
  id: string;
  tenantId: string;
  moduleId: string;
  title: string;
  slug: string;
  description?: string | null;
  contentText?: string | null;
  durationMinutes: number;
  sortOrder: number;
  isPublished: boolean;
  isFreePreview: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LessonContent {
  id: string;
  tenantId: string;
  lessonId: string;
  type: LessonContentType;
  title?: string | null;
  url: string;
  provider?: string | null;
  providerId?: string | null;
  fileSizeBytes?: number | null;
  mimeType?: string | null;
  durationSeconds?: number | null;
  sortOrder: number;
  metadata?: Record<string, any>;
  isDownloadable: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Question {
  id: string;
  tenantId: string;
  statement: string;
  statementImageUrl?: string | null;
  explanation?: string | null;
  subject: string;
  topic?: string | null;
  difficulty: QuestionDifficulty;
  tags: string[];
  isActive: boolean;
  createdBy?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface QuestionOption {
  id: string;
  questionId: string;
  label: string;
  text: string;
  imageUrl?: string | null;
  isCorrect?: boolean; // omitido no client de estudantes antes de responder
  sortOrder: number;
}

export interface Quiz {
  id: string;
  tenantId: string;
  title: string;
  description?: string | null;
  timeLimitMinutes?: number | null;
  maxAttempts: number;
  questionCount: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showAnswersAfter: QuizShowAnswers;
  startsAt?: Date | string | null;
  endsAt?: Date | string | null;
  isPublished: boolean;
  courseId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Enrollment {
  id: string;
  tenantId: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  source: EnrollmentSource;
  orderId?: string | null;
  startsAt: Date | string;
  expiresAt?: Date | string | null;
  completedAt?: Date | string | null;
  progressPercent: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LessonProgress {
  id: string;
  tenantId: string;
  userId: string;
  lessonId: string;
  enrollmentId: string;
  status: LessonProgressStatus;
  watchedSeconds: number;
  completedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// -------------------------------------------------------------
// AUTH & API CONTRACTS
// -------------------------------------------------------------

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthUserResponse {
  user: Omit<User, 'passwordHash'>;
  tokens: AuthTokens;
}

export interface JwtPayload {
  sub: string;
  tenantId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
