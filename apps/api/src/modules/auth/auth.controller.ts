import { Controller, Post, Patch, Body, Get, Query, UsePipes, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  registerSchema,
  loginSchema,
  RegisterInput,
  LoginInput,
} from '@studyead/validators';
import { JwtPayload } from '@studyead/shared-types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('check-pre-registration')
  async checkPreRegistration(
    @Query('email') email?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.authService.checkPreRegistration(email, tenantId);
  }

  @Public()
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(
    @Body() body: RegisterInput,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.authService.register(body, tenantId);
  }

  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() body: LoginInput,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.authService.login(body, tenantId);
  }

  @Get('me')
  async me(@CurrentUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() body: { name?: string; phone?: string },
  ) {
    return this.authService.updateMe(user.sub, body);
  }

  @Post('change-password')
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(user.sub, body.currentPassword, body.newPassword);
  }
}
