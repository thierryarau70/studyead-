import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtPayload, UserRole } from '@studyead/shared-types';

@Controller('users')
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query('role') role?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser() user?: JwtPayload,
  ) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.usersService.getUsers(tenantId, { role, search, page, limit });
  }

  @Get(':id')
  async getUser(
    @Param('id') userId: string,
    @CurrentUser() user?: JwtPayload,
  ) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.usersService.getUserById(tenantId, userId);
  }

  @Post()
  async createUser(
    @Body() body: any,
    @CurrentUser() user: JwtPayload,
  ) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.usersService.createUser(tenantId, body);
  }

  @Put(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() body: any,
    @CurrentUser() user: JwtPayload,
  ) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.usersService.updateUser(tenantId, userId, body);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') userId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.usersService.deleteUser(tenantId, userId);
  }
}
