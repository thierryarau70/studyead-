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

  async register(input: RegisterInput, tenantId?: string): Promise<AuthUserResponse> {
    const activeTenantId = tenantId || this.defaultTenantId;

    const existing = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: activeTenantId,
          email: input.email.toLowerCase(),
        },
      },
    });

    if (existing) {
      throw new ConflictException('Já existe uma conta cadastrada com este e-mail');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await this.prisma.user.create({
      data: {
        tenantId: activeTenantId,
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone || null,
        passwordHash,
        role: UserRole.STUDENT,
        isActive: true,
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

    if (!user.isActive) {
      throw new UnauthorizedException('Sua conta está desativada. Entre em contato com o suporte.');
    }

    const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
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
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
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
