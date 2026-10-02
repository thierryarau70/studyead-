import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtPayload, UserRole } from '@studyead/shared-types';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createCourseSchema,
  createModuleSchema,
  createLessonSchema,
  createLessonContentSchema,
  updateLessonProgressSchema,
  CreateCourseInput,
  CreateModuleInput,
  CreateLessonInput,
  CreateLessonContentInput,
  UpdateLessonProgressInput,
} from '@studyead/validators';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * Public or Student: List catalog courses
   */
  @Public()
  @Get()
  async getCourses(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('all') all?: string,
    @CurrentUser() user?: JwtPayload,
  ) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    const isPublicOnly = all === 'true' ? false : true;
    return this.coursesService.getCourses(tenantId, { search, category, page, limit }, isPublicOnly);
  }

  /**
   * Get single course details (with modules, lessons and optional student progress)
   */
  @Public()
  @Get(':slugOrId')
  async getCourseBySlugOrId(
    @Param('slugOrId') slugOrId: string,
    @CurrentUser() user?: JwtPayload,
  ) {
    const tenantId = user?.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.coursesService.getCourseBySlugOrId(tenantId, slugOrId, user?.sub);
  }

  /**
   * Get single lesson details & player content
   */
  @Get('lessons/:lessonId')
  async getLessonWithDetails(
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.getLessonWithDetails(user.tenantId, lessonId, user.sub);
  }

  /**
   * Student: Update watched time / mark lesson completed
   */
  @Post('lessons/:lessonId/progress')
  @UsePipes(new ZodValidationPipe(updateLessonProgressSchema))
  async updateLessonProgress(
    @Param('lessonId') lessonId: string,
    @Body() body: UpdateLessonProgressInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.updateProgress(user.tenantId, user.sub, lessonId, body);
  }

  /**
   * Admin: Create new course
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  @UsePipes(new ZodValidationPipe(createCourseSchema))
  async createCourse(
    @Body() body: CreateCourseInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.createCourse(user.tenantId, body);
  }

  /**
   * Admin: Create module in a course
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post(':courseId/modules')
  @UsePipes(new ZodValidationPipe(createModuleSchema))
  async createModule(
    @Param('courseId') courseId: string,
    @Body() body: CreateModuleInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.createModule(user.tenantId, courseId, body);
  }

  /**
   * Admin: Create lesson in a module
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post('modules/:moduleId/lessons')
  @UsePipes(new ZodValidationPipe(createLessonSchema))
  async createLesson(
    @Param('moduleId') moduleId: string,
    @Body() body: CreateLessonInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.createLesson(user.tenantId, moduleId, body);
  }

  /**
   * Admin: Create content attachment/video in a lesson
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post('lessons/:lessonId/contents')
  @UsePipes(new ZodValidationPipe(createLessonContentSchema))
  async createLessonContent(
    @Param('lessonId') lessonId: string,
    @Body() body: CreateLessonContentInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.createLessonContent(user.tenantId, lessonId, body);
  }

  /**
   * Admin: Update course
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put(':id')
  async updateCourse(
    @Param('id') courseId: string,
    @Body() body: any,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.updateCourse(user.tenantId, courseId, body);
  }

  /**
   * Admin: Delete course
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  async deleteCourse(
    @Param('id') courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.deleteCourse(user.tenantId, courseId);
  }

  /**
   * Admin: Update module
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put('modules/:moduleId')
  async updateModule(
    @Param('moduleId') moduleId: string,
    @Body() body: any,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.updateModule(user.tenantId, moduleId, body);
  }

  /**
   * Admin: Delete module
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete('modules/:moduleId')
  async deleteModule(
    @Param('moduleId') moduleId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.deleteModule(user.tenantId, moduleId);
  }

  /**
   * Admin: Update lesson
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put('lessons/:lessonId')
  async updateLesson(
    @Param('lessonId') lessonId: string,
    @Body() body: any,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.updateLesson(user.tenantId, lessonId, body);
  }

  /**
   * Admin: Delete lesson
   */
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete('lessons/:lessonId')
  async deleteLesson(
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.deleteLesson(user.tenantId, lessonId);
  }
}

