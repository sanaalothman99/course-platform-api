import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('lesson/:lessonId')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Request() req: any,
    @Param('lessonId') lessonId: string,
    @Body() body: { content: string },
  ) {
    return this.commentsService.createComment(req.user.id, lessonId, body.content);
  }

  @Post('reply/:parentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  replyToComment(
    @Request() req: any,
    @Param('parentId') parentId: string,
    @Body() body: { content: string; lessonId: string },
  ) {
    return this.commentsService.replyToComment(req.user.id, body.lessonId, body.content, parentId);
  }

  @Get('lesson/:lessonId')
  @UseGuards(JwtAuthGuard)
  getLessonComments(@Param('lessonId') lessonId: string) {
    return this.commentsService.getLessonComments(lessonId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAllComments() {
    return this.commentsService.getAllComments();
  }
}