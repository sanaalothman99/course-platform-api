import { Controller, Post, Get, Query, Res, UseInterceptors, UploadedFile, Param, UseGuards } from '@nestjs/common;
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import express from 'express';
import { Res } from '@nestjs/common';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('video/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Param('courseId') courseId: string,
  ) {
    return this.uploadService.uploadVideo(file, courseId);
  }

  @Post('pdf/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @Param('courseId') courseId: string,
  ) {
    return this.uploadService.uploadPdf(file, courseId);
  }

  @Post('image/:folder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: string,
  ) {
    return this.uploadService.uploadImage(file, folder);
  }
  @Post('file/:folder')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@UseInterceptors(FileInterceptor('file'))
uploadFile(
  @UploadedFile() file: Express.Multer.File,
  @Param('folder') folder: string,
) {
  return this.uploadService.uploadFile(file, folder);
}
@Get('download')
async downloadFile(
  @Query('url') url: string,
  @Query('filename') filename: string,
  @Res() res: express.Response,
) {
  return this.uploadService.streamDownload(url, filename, res);
}
}