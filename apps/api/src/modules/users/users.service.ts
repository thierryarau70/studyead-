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
          createdAt: true,
          _count: {
            select: { enrollments: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users.map((u) => ({
        ...u,
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
    const existing = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email: input.email.toLowerCase().trim(),
        },
      },
    });

    if (existing) {
      throw new BadRequestException('E-mail já cadastrado na plataforma');
    }

    const password = input.password || 'Mudar@123';
    const passwordHash = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        tenantId,
        name: input.name,
        email: input.email.toLowerCase().trim(),
        passwordHash,
        role: input.role || 'student',
        phone: input.phone,
        isActive: input.isActive !== undefined ? Boolean(input.isActive) : true,
      },
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
    if (input.isActive !== undefined) data.isActive = Boolean(input.isActive);

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

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { success: true, message: 'Usuário excluído com sucesso' };
  }
}
