import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * List platform users
   */
  async getUsers(
    tenantId: string,
    query: { role?: string; search?: string; page?: number; limit?: number } = {},
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (query.role) {
      where.role = query.role;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          tenantId: true,
          role: true,
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
          isActive: true,
          lastLoginAt: true,
          emailVerifiedAt: true,
          createdAt: true,
          enrollments: {
            where: { status: 'active' },
            select: { courseId: true },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users.map((u) => ({
        id: u.id,
        tenantId: u.tenantId,
        role: u.role,
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatarUrl: u.avatarUrl,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
        isPreRegistered: u.lastLoginAt === null && u.emailVerifiedAt === null,
        enrolledCourseIds: u.enrollments ? u.enrollments.map((e) => e.courseId) : [],
        enrollmentsCount: u._count.enrollments,
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
   * Get single user by ID
   */
  async getUserById(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
      select: {
        id: true,
        tenantId: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        enrollments: {
          include: {
            course: {
              select: { id: true, title: true, slug: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  /**
   * Admin: Create new user
   */
  async createUser(tenantId: string, input: any) {
    const cleanEmail = input.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email: cleanEmail,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('E-mail já cadastrado na plataforma');
    }

    const isStudent = (input.role || 'student') === 'student';
    const isPreRegistered = input.isPreRegistration !== undefined ? Boolean(input.isPreRegistration) : isStudent;
    const password = input.password || (isPreRegistered ? `PreReg_${Date.now()}` : 'Mudar@123');
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        tenantId,
        name: input.name?.trim(),
        email: cleanEmail,
        passwordHash,
        role: input.role || 'student',
        phone: input.phone || null,
        isActive: input.isActive !== undefined ? Boolean(input.isActive) : true,
        emailVerifiedAt: isPreRegistered ? null : new Date(),
        lastLoginAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        lastLoginAt: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });

    // Optionally enroll into initial courses immediately
    if (Array.isArray(input.courseIds) && input.courseIds.length > 0) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validCourseIds = input.courseIds.filter((cId: string) => uuidRegex.test(cId));
      if (validCourseIds.length > 0) {
        const validCourses = await this.prisma.course.findMany({
          where: { id: { in: validCourseIds }, tenantId },
          select: { id: true },
        });
        for (const course of validCourses) {
          await this.prisma.enrollment.create({
            data: {
              tenantId,
              userId: user.id,
              courseId: course.id,
              source: 'admin',
              status: 'active',
            },
          }).catch(() => {});
        }
      }
    }

    return {
      ...user,
      isPreRegistered,
    };
  }

  /**
   * Admin: Update user's course enrollments
   */
  async updateUserCourses(tenantId: string, userId: string, courseIds: string[]) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validCourseIds = (Array.isArray(courseIds) ? courseIds : []).filter((id) => uuidRegex.test(id));

    const currentEnrollments = await this.prisma.enrollment.findMany({
      where: { userId, tenantId },
      select: { id: true, courseId: true },
    });

    const currentCourseIds = currentEnrollments.map((e) => e.courseId);

    const toRemove = currentEnrollments.filter((e) => !validCourseIds.includes(e.courseId));
    if (toRemove.length > 0) {
      await this.prisma.enrollment.deleteMany({
        where: { id: { in: toRemove.map((e) => e.id) } },
      });
    }

    const toAdd = validCourseIds.filter((cId) => !currentCourseIds.includes(cId));
    for (const cId of toAdd) {
      await this.prisma.enrollment.create({
        data: {
          tenantId,
          userId,
          courseId: cId,
          source: 'admin',
          status: 'active',
        },
      }).catch(() => {});
    }

    return {
      success: true,
      userId,
      enrolledCourseIds: validCourseIds,
      enrollmentsCount: validCourseIds.length,
    };
  }

  /**
   * Admin: Update user
   */
  async updateUser(tenantId: string, userId: string, input: any) {
    const existing = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const data: any = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.role !== undefined) data.role = input.role;
    if (input.phone !== undefined) data.phone = input.phone;
    if (input.isActive !== undefined) {
      if ((existing.role === 'admin' || existing.role === 'super_admin') && !input.isActive) {
        data.isActive = true;
      } else {
        data.isActive = Boolean(input.isActive);
      }
    }

    if (input.password) {
      data.passwordHash = await bcrypt.hash(input.password, 10);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  /**
   * Admin: Delete user
   */
  async deleteUser(tenantId: string, userId: string) {
    const existing = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (existing.role === 'admin' || existing.role === 'super_admin') {
      throw new BadRequestException('Contas de administrador não podem ser excluídas');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { success: true, message: 'Usuário excluído com sucesso' };
  }
}
