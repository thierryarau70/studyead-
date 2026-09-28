import { Controller, Post, Body, Get, UsePipes, Headers } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
