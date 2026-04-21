import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }
  @Put(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
update(
  @Param('id') id: string,
  @Body() body: Partial<{
    title: string;
    description: string;
    price: number;
    level: string;
    thumbnail: string;
    comingSoon: boolean;
    hasLevels: boolean;
    previewUrl: string;
  }>,
) {
  return this.coursesService.update(id, body);
}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() body: {
    title: string;
    description: string;
    price: number;
    level: string;
  }) {
    return this.coursesService.create(body);
  }

@Put('lessons/:lessonId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
updateLesson(
  @Param('lessonId') lessonId: string,
  @Body() body: {
    title?: string
    videoUrl?: string
    description?: string
    pdfUrl?: string
  },
) {
  return this.coursesService.updateLesson(lessonId, body);
}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }

  @Post(':id/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  addLesson(@Param('id') courseId: string, @Body() body: {
    title: string;
    videoUrl?: string;
    position: number;
  }) {
    return this.coursesService.addLesson(courseId, body);
  }
  @Delete('lessons/:lessonId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
deleteLesson(@Param('lessonId') lessonId: string) {
  return this.coursesService.deleteLesson(lessonId);
}
@Get(':id/sub-courses')
getSubCourses(@Param('id') id: string) {
  return this.coursesService.getSubCourses(id);
}
@Post(':id/chapters')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
addChapter(
  @Param('id') courseId: string,
  @Body() body: { title: string; position: number },
) {
  return this.coursesService.addChapter(courseId, body);
}

@Put('chapters/:chapterId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
updateChapter(
  @Param('chapterId') chapterId: string,
  @Body() body: { title?: string; position?: number },
) {
  return this.coursesService.updateChapter(chapterId, body);
}

@Delete('chapters/:chapterId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
deleteChapter(@Param('chapterId') chapterId: string) {
  return this.coursesService.deleteChapter(chapterId);
}

@Post('chapters/:chapterId/lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
addLessonToChapter(
  @Param('chapterId') chapterId: string,
  @Body() body: { title: string; position: number; courseId: string },
) {
  return this.coursesService.addLessonToChapter(chapterId, body.courseId, {
    title: body.title,
    position: body.position,
  });
}
@Put(':id/preview')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
updatePreview(
  @Param('id') id: string,
  @Body() body: { previewUrl: string },
) {
  return this.coursesService.update(id, { previewUrl: body.previewUrl });
}
@Post('progress/:lessonId/complete')
@UseGuards(JwtAuthGuard)
markComplete(
  @Param('lessonId') lessonId: string,
  @Request() req: any,
) {
  return this.coursesService.markComplete(req.user.id, lessonId);
}

@Delete('progress/:lessonId/complete')
@UseGuards(JwtAuthGuard)
markIncomplete(
  @Param('lessonId') lessonId: string,
  @Request() req: any,
) {
  return this.coursesService.markIncomplete(req.user.id, lessonId);
}

@Get(':id/progress')
@UseGuards(JwtAuthGuard)
getProgress(
  @Param('id') courseId: string,
  @Request() req: any,
) {
  return this.coursesService.getProgress(req.user.id, courseId);
}
}