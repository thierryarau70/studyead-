import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import {
  RegisterInput,
  LoginInput,
} from '@studyead/validators';
import {
  UserRole,
  AuthUserResponse,
  JwtPayload,
} from '@studyead/shared-types';

@Injectable()
export class AuthService {
  private readonly defaultTenantId: string;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.defaultTenantId = this.configService.get<string>(
      'DEFAULT_TENANT_ID',
      '00000000-0000-0000-0000-000000000001',
    );
  }

  async checkPreRegistration(email?: string, tenantId?: string) {
    if (!email) {
      return { isPreRegistered: false, alreadyRegistered: false };
    }
    const activeTenantId = tenantId || this.defaultTenantId;
    const cleanEmail = email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: activeTenantId,
          email: cleanEmail,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        lastLoginAt: true,
        emailVerifiedAt: true,
        isActive: true,
      },
    });

    if (!user) {
      return { isPreRegistered: false, alreadyRegistered: false };
    }

    // A user is considered pre-registered if they were created by admin and have never completed password setup (emailVerifiedAt is null and lastLoginAt is null)
    const isPreRegistered = user.lastLoginAt === null && user.emailVerifiedAt === null;

    return {
      isPreRegistered,
      alreadyRegistered: !isPreRegistered,
      name: user.name,
      phone: user.phone,
      email: user.email,
    };
  }

  async register(input: RegisterInput, tenantId?: string): Promise<AuthUserResponse> {
    const activeTenantId = tenantId || this.defaultTenantId;
    const cleanEmail = input.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: activeTenantId,
          email: cleanEmail,
        },
      },
    });

    const passwordHash = await bcrypt.hash(input.password, 12);

    if (existing) {
      // Check if user was pre-registered (never logged in and emailVerifiedAt is null)
      const isPreRegistered = existing.lastLoginAt === null && existing.emailVerifiedAt === null;
      if (isPreRegistered) {
        // Complete the pre-registration!
        const updatedUser = await this.prisma.user.update({
          where: { id: existing.id },
          data: {
            name: input.name?.trim() || existing.name,
            phone: input.phone || existing.phone,
            passwordHash,
            emailVerifiedAt: new Date(),
            lastLoginAt: new Date(),
            isActive: true,
          },
        });

        const tokens = this.generateTokens(updatedUser);

        return {
          user: {
            id: updatedUser.id,
            tenantId: updatedUser.tenantId,
            role: updatedUser.role as UserRole,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            avatarUrl: updatedUser.avatarUrl,
            isActive: updatedUser.isActive,
            emailVerifiedAt: updatedUser.emailVerifiedAt,
            lastLoginAt: updatedUser.lastLoginAt,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
          },
          tokens,
        };
      }

      throw new ConflictException('Já existe uma conta ativa cadastrada com este e-mail');
    }

    const user = await this.prisma.user.create({
      data: {
        tenantId: activeTenantId,
        name: input.name,
        email: cleanEmail,
        phone: input.phone || null,
        passwordHash,
        role: UserRole.STUDENT,
        isActive: true,
        lastLoginAt: null,
        emailVerifiedAt: null,
      },
    });

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user.id,
        tenantId: user.tenantId,
        role: user.role as UserRole,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        emailVerifiedAt: user.emailVerifiedAt,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async login(input: LoginInput, tenantId?: string): Promise<AuthUserResponse> {
    const activeTenantId = tenantId || this.defaultTenantId;

    const user = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: activeTenantId,
          email: input.email.toLowerCase(),
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Auto-heal admin accounts: admins should never be locked out
    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      if (!user.isActive) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { isActive: true },
        });
        user.isActive = true;
      }
    } else if (!user.isActive) {
      throw new UnauthorizedException('Sua conta está desativada. Entre em contato com o suporte.');
    }

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Auto-enroll student into active published courses if they don't have enrollments yet
    let enrolledCourseIds: string[] = [];
    if (user.role === UserRole.STUDENT) {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { userId: user.id, tenantId: activeTenantId, status: 'active' },
        select: { courseId: true },
      });
      enrolledCourseIds = enrollments.map((e) => e.courseId);

      // If the student has 0 enrollments or is the demo student, ensure access to published courses
      if (enrolledCourseIds.length === 0 || user.email === 'aluno@cursinhoalpha.com.br') {
        const publishedCourses = await this.prisma.course.findMany({
          where: { tenantId: activeTenantId, isPublished: true },
          select: { id: true },
        });
        for (const p of publishedCourses) {
          await this.prisma.enrollment.upsert({
            where: {
              userId_courseId: {
                userId: user.id,
                courseId: p.id,
              },
            },
            update: { status: 'active' },
            create: {
              tenantId: activeTenantId,
              userId: user.id,
              courseId: p.id,
              source: 'courtesy',
              status: 'active',
            },
          }).catch(() => {});
        }
        enrolledCourseIds = publishedCourses.map((p) => p.id);
      }
    }

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user.id,
        tenantId: user.tenantId,
        role: user.role as UserRole,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        emailVerifiedAt: user.emailVerifiedAt,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        enrolledCourseIds,
      },
      tokens,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
          where: { status: 'active' },
          select: { courseId: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    let enrolledCourseIds = user.enrollments ? user.enrollments.map((e) => e.courseId) : [];

    // Auto-heal demo student or newly activated students with 0 courses
    if (user.role === 'student' && (enrolledCourseIds.length === 0 || user.email === 'aluno@cursinhoalpha.com.br')) {
      const published = await this.prisma.course.findMany({
        where: { tenantId: user.tenantId, isPublished: true },
        select: { id: true },
      });
      for (const p of published) {
        await this.prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: p.id,
            },
          },
          update: { status: 'active' },
          create: {
            tenantId: user.tenantId,
            userId: user.id,
            courseId: p.id,
            source: 'courtesy',
            status: 'active',
          },
        }).catch(() => {});
      }
      enrolledCourseIds = published.map((p) => p.id);
    }

    return {
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      enrolledCourseIds,
    };
  }

  async updateMe(userId: string, input: { name?: string; phone?: string }) {
    const data: any = {};
    if (input.name?.trim()) data.name = input.name.trim();
    if (input.phone !== undefined) data.phone = input.phone || null;

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    if (newPassword.length < 8) {
      throw new UnauthorizedException('A nova senha deve ter pelo menos 8 caracteres');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });

    return { message: 'Senha alterada com sucesso' };
  }

  private generateTokens(user: { id: string; tenantId: string; email: string; role: any }) {
    const payload: JwtPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role as UserRole,
    };

    const expiresIn = 60 * 60 * 24; // 24 hours for dev/MVP

    const accessToken = this.jwtService.sign(payload, {
      expiresIn,
    });

    return {
      accessToken,
      expiresIn,
    };
  }
}
