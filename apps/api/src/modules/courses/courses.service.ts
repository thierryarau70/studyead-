import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateCourseInput,
  UpdateCourseInput,
  CreateModuleInput,
  CreateLessonInput,
  CreateLessonContentInput,
  UpdateLessonProgressInput,
} from '@studyead/validators';
import { LessonProgressStatus } from '@studyead/shared-types';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  /**
   * List catalog courses for a tenant (published only for students or all for admins)
   */
  async getCourses(
    tenantId: string,
    query: { search?: string; category?: string; page?: number; limit?: number } = {},
    isPublicOnly = true,
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
      ...(isPublicOnly ? { isPublished: true } : {}),
    };

    if (query.category) {
      where.category = query.category;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          tenantId: true,
          title: true,
          slug: true,
          description: true,
          thumbnailUrl: true,
          priceCents: true,
          originalPriceCents: true,
          isPublished: true,
          isFree: true,
          totalDurationMinutes: true,
          totalLessons: true,
          category: true,
          tags: true,
          createdAt: true,
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single course with modules, lessons, and progress for user
   */
  async getCourseBySlugOrId(tenantId: string, slugOrId: string, userId?: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    const course = await this.prisma.course.findFirst({
      where: {
        tenantId,
        ...(isUuid ? { id: slugOrId } : { slug: slugOrId }),
      },
      include: {
        modules: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                title: true,
                slug: true,
                durationMinutes: true,
                sortOrder: true,
                isFreePreview: true,
                contents: {
                  select: {
                    id: true,
                    type: true,
                    title: true,
                    url: true,
                    durationSeconds: true,
                    isDownloadable: true,
                  },
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    // Fetch user enrollment and progress if logged in
    let enrollment: any = null;
    let progressMap: Record<string, { watchedSeconds: number; status: string; completedAt?: Date | null }> = {};

    if (userId) {
      enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
      });

      if (enrollment) {
        const progresses = await this.prisma.lessonProgress.findMany({
          where: {
            userId,
            enrollmentId: enrollment.id,
          },
        });

        for (const p of progresses) {
          progressMap[p.lessonId] = {
            watchedSeconds: p.watchedSeconds,
            status: p.status,
            completedAt: p.completedAt,
          };
        }
      }
    }

    return {
      ...course,
      enrollment,
      userProgress: progressMap,
    };
  }

  /**
   * Get single lesson details with materials & user progress
   */
  async getLessonWithDetails(tenantId: string, lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, tenantId },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
        contents: {
          orderBy: { sortOrder: 'asc' },
        },
        questions: {
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
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Aula não encontrada');
    }

    // Verify enrollment
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.module.courseId,
        },
      },
    });

    if (!enrollment && !lesson.isFreePreview) {
      throw new ForbiddenException('Você não tem matrícula ativa para acessar esta aula.');
    }

    // Fetch progress
    let progress: any = null;
    if (enrollment) {
      progress = await this.prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId: lesson.id,
          },
        },
      });
    }

    // Fetch adjacent lessons for navigation (prev/next)
    const allModuleLessons = await this.prisma.lesson.findMany({
      where: {
        moduleId: lesson.moduleId,
        isPublished: true,
      },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true, slug: true },
    });

    const currentIndex = allModuleLessons.findIndex((l) => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? allModuleLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allModuleLessons.length - 1 ? allModuleLessons[currentIndex + 1] : null;

    return {
      lesson,
      progress,
      navigation: {
        prevLesson,
        nextLesson,
      },
    };
  }

  /**
   * Update or mark lesson progress
   */
  async updateProgress(
    tenantId: string,
    userId: string,
    lessonId: string,
    input: UpdateLessonProgressInput,
  ) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, tenantId },
      select: { id: true, moduleId: true, module: { select: { courseId: true } } },
    });

    if (!lesson) {
      throw new NotFoundException('Aula não encontrada');
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.module.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('Matrícula ativa não encontrada para registrar progresso');
    }

    const isCompleted = input.completed === true;
    const status = isCompleted ? LessonProgressStatus.COMPLETED : LessonProgressStatus.IN_PROGRESS;

    const progress = await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        watchedSeconds: input.watchedSeconds ?? undefined,
        status,
        ...(isCompleted ? { completedAt: new Date() } : {}),
      },
      create: {
        tenantId,
        userId,
        lessonId,
        enrollmentId: enrollment.id,
        watchedSeconds: input.watchedSeconds || 0,
        status,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Recalculate enrollment progress percent
    const [totalCourseLessons, completedProgresses] = await Promise.all([
      this.prisma.lesson.count({
        where: {
          module: { courseId: lesson.module.courseId },
          isPublished: true,
        },
      }),
      this.prisma.lessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          status: LessonProgressStatus.COMPLETED,
        },
      }),
    ]);

    const progressPercent = totalCourseLessons > 0 ? (completedProgresses / totalCourseLessons) * 100 : 0;

    await this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPercent: Number(progressPercent.toFixed(2)),
        ...(progressPercent >= 100 ? { completedAt: new Date() } : {}),
      },
    });

    return {
      progress,
      overallProgressPercent: Number(progressPercent.toFixed(2)),
    };
  }

  /**
   * Admin: Create course
   */
  async createCourse(tenantId: string, input: CreateCourseInput) {
    const slug =
      input.slug ||
      input.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const existingSlug = await this.prisma.course.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (existingSlug) {
      throw new BadRequestException('Já existe um curso com este slug');
    }

    const isPublished = Boolean(input.isPublished);

    return this.prisma.course.create({
      data: {
        tenantId,
        title: input.title,
        slug,
        description: input.description,
        longDescription: input.longDescription,
        thumbnailUrl: input.thumbnailUrl || null,
        priceCents: input.priceCents || 0,
        originalPriceCents: input.originalPriceCents,
        isFree: Boolean(input.isFree),
        isPublished,
        status: isPublished ? 'published' : 'draft',
        publishedAt: isPublished ? new Date() : null,
        category: input.category,
        tags: input.tags || [],
        sortOrder: input.sortOrder || 0,
      },
    });
  }

  /**
   * Admin: Create module
   */
  async createModule(tenantId: string, courseId: string, input: CreateModuleInput) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, tenantId },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return this.prisma.courseModule.create({
      data: {
        tenantId,
        courseId,
        title: input.title,
        description: input.description,
        sortOrder: input.sortOrder,
        isPublished: input.isPublished,
      },
    });
  }

  /**
   * Admin: Create lesson
   */
  async createLesson(tenantId: string, moduleId: string, input: CreateLessonInput) {
    const module = await this.prisma.courseModule.findFirst({
      where: { id: moduleId, tenantId },
      include: { course: true },
    });

    if (!module) {
      throw new NotFoundException('Módulo não encontrado');
    }

    const slug =
      input.slug ||
      input.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const lesson = await this.prisma.lesson.create({
      data: {
        tenantId,
        moduleId,
        title: input.title,
        slug,
        description: input.description,
        contentText: input.contentText,
        durationMinutes: input.durationMinutes,
        sortOrder: input.sortOrder,
        isPublished: input.isPublished,
        isFreePreview: input.isFreePreview,
      },
    });

    // Update total lessons count in course
    const totalLessons = await this.prisma.lesson.count({
      where: { module: { courseId: module.courseId } },
    });

    await this.prisma.course.update({
      where: { id: module.courseId },
      data: { totalLessons },
    });

    return lesson;
  }

  /**
   * Admin: Create lesson content
   */
  async createLessonContent(tenantId: string, lessonId: string, input: CreateLessonContentInput) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, tenantId },
    });

    if (!lesson) {
      throw new NotFoundException('Aula não encontrada');
    }

    return this.prisma.lessonContent.create({
      data: {
        tenantId,
        lessonId,
        type: input.type,
        title: input.title,
        url: input.url,
        provider: input.provider,
        providerId: input.providerId,
        fileSizeBytes: input.fileSizeBytes ? BigInt(input.fileSizeBytes) : null,
        mimeType: input.mimeType,
        durationSeconds: input.durationSeconds,
        sortOrder: input.sortOrder,
        metadata: input.metadata || {},
        isDownloadable: input.isDownloadable,
      },
    });
  }

  /**
   * Admin: Update Course
   */
  async updateCourse(tenantId: string, courseId: string, input: any) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);
    const existing = await this.prisma.course.findFirst({
      where: {
        tenantId,
        ...(isUuid ? { id: courseId } : { slug: courseId }),
      },
    });

    if (!existing) {
      throw new NotFoundException('Curso não encontrado');
    }

    const data: any = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.longDescription !== undefined) data.longDescription = input.longDescription;
    if (input.thumbnailUrl !== undefined) data.thumbnailUrl = input.thumbnailUrl;
    if (input.priceCents !== undefined) data.priceCents = Number(input.priceCents);
    if (input.originalPriceCents !== undefined) data.originalPriceCents = Number(input.originalPriceCents);
    if (input.isFree !== undefined) data.isFree = Boolean(input.isFree);
    if (input.category !== undefined) data.category = input.category;
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.sortOrder !== undefined) data.sortOrder = Number(input.sortOrder);
    if (input.isPublished !== undefined) {
      data.isPublished = Boolean(input.isPublished);
      data.status = data.isPublished ? 'published' : 'draft';
      if (data.isPublished && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
    }
    if (input.status !== undefined) data.status = input.status;

    return this.prisma.course.update({
      where: { id: existing.id },
      data,
    });
  }

  /**
   * Admin: Delete Course
   */
  async deleteCourse(tenantId: string, courseId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);
    const existing = await this.prisma.course.findFirst({
      where: {
        tenantId,
        ...(isUuid ? { id: courseId } : { slug: courseId }),
      },
    });

    if (!existing) {
      throw new NotFoundException('Curso não encontrado');
    }

    await this.prisma.course.delete({
      where: { id: existing.id },
    });

    return { success: true, message: 'Curso excluído com sucesso' };
  }

  /**
   * Admin: Update Module
   */
  async updateModule(tenantId: string, moduleId: string, input: any) {
    const existing = await this.prisma.courseModule.findFirst({
      where: { id: moduleId, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Módulo não encontrado');
    }

    const data: any = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.sortOrder !== undefined) data.sortOrder = Number(input.sortOrder);
    if (input.isPublished !== undefined) data.isPublished = Boolean(input.isPublished);

    return this.prisma.courseModule.update({
      where: { id: moduleId },
      data,
    });
  }

  /**
   * Admin: Delete Module
   */
  async deleteModule(tenantId: string, moduleId: string) {
    const existing = await this.prisma.courseModule.findFirst({
      where: { id: moduleId, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Módulo não encontrado');
    }

    await this.prisma.courseModule.delete({
      where: { id: moduleId },
    });

    return { success: true, message: 'Módulo excluído com sucesso' };
  }

  /**
   * Admin: Update Lesson
   */
  async updateLesson(tenantId: string, lessonId: string, input: any) {
    const existing = await this.prisma.lesson.findFirst({
      where: { id: lessonId, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Aula não encontrada');
    }

    const data: any = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.contentText !== undefined) data.contentText = input.contentText;
    if (input.durationMinutes !== undefined) data.durationMinutes = Number(input.durationMinutes);
    if (input.sortOrder !== undefined) data.sortOrder = Number(input.sortOrder);
    if (input.isPublished !== undefined) data.isPublished = Boolean(input.isPublished);
    if (input.isFreePreview !== undefined) data.isFreePreview = Boolean(input.isFreePreview);

    const updated = await this.prisma.lesson.update({
      where: { id: lessonId },
      data,
    });

    // Se tiver videoUrl informado no input, cria ou atualiza lessonContent
    if (input.videoUrl) {
      const existingContent = await this.prisma.lessonContent.findFirst({
        where: { lessonId, type: 'video' },
      });
      if (existingContent) {
        await this.prisma.lessonContent.update({
          where: { id: existingContent.id },
          data: { url: input.videoUrl },
        });
      } else {
        await this.prisma.lessonContent.create({
          data: {
            tenantId,
            lessonId,
            type: 'video',
            title: 'Vídeo da Aula',
            url: input.videoUrl,
          },
        });
      }
    }

    return updated;
  }

  /**
   * Admin: Delete Lesson
   */
  async deleteLesson(tenantId: string, lessonId: string) {
    const existing = await this.prisma.lesson.findFirst({
      where: { id: lessonId, tenantId },
      include: { module: true },
    });

    if (!existing) {
      throw new NotFoundException('Aula não encontrada');
    }

    await this.prisma.lesson.delete({
      where: { id: lessonId },
    });

    // Update course totalLessons
    const totalLessons = await this.prisma.lesson.count({
      where: { module: { courseId: existing.module.courseId } },
    });

    await this.prisma.course.update({
      where: { id: existing.module.courseId },
      data: { totalLessons },
    });

    return { success: true, message: 'Aula excluída com sucesso' };
  }
}

