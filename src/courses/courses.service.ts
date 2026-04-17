import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
  return this.prisma.course.findMany({
    include: { 
      lessons: true,
      children: true,
    },
  });
}

 async findOne(id: string) {
  return this.prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        where: { chapterId: null },
      },
      chapters: {
        include: { lessons: true },
        orderBy: { position: 'asc' },
      },
    },
  });
}

  async create(data: {
  title: string;
  description: string;
  price: number;
  level: string;
  thumbnail?: string;
  hasLevels?: boolean;
  comingSoon?: boolean;
}) {
  return this.prisma.course.create({ data });
}

 async updateLesson(lessonId: string, data: {
  title?: string
  videoUrl?: string
  description?: string
  pdfUrl?: string
}) {
  return this.prisma.lesson.update({
    where: { id: lessonId },
    data,
  });
}
async delete(id: string) {
  // جيب الكورسات الفرعية
  const subCourses = await this.prisma.course.findMany({
    where: { parentId: id },
    include: { lessons: true },
  });

  // احذف كل شي تبع كل كورس فرعي
  for (const sub of subCourses) {
    for (const lesson of sub.lessons) {
      await this.prisma.comment.deleteMany({
        where: { lessonId: lesson.id },
      });
    }
    await this.prisma.lesson.deleteMany({
      where: { courseId: sub.id },
    });
    await this.prisma.order.deleteMany({
      where: { courseId: sub.id },
    });
    await this.prisma.course.delete({
      where: { id: sub.id },
    });
  }

  // بعدها احذف الكورس الرئيسي
  const lessons = await this.prisma.lesson.findMany({
    where: { courseId: id },
  });

  for (const lesson of lessons) {
    await this.prisma.comment.deleteMany({
      where: { lessonId: lesson.id },
    });
  }

  await this.prisma.lesson.deleteMany({ where: { courseId: id } });
  await this.prisma.order.deleteMany({ where: { courseId: id } });
  return this.prisma.course.delete({ where: { id } });
}

async deleteLesson(lessonId: string) {
  // احذف التعليقات أول
  await this.prisma.comment.deleteMany({
    where: { lessonId },
  });

  // احذف الدرس
  return this.prisma.lesson.delete({
    where: { id: lessonId },
  });
}

  async addLesson(courseId: string, data: {
    title: string;
    videoUrl?: string;
    position: number;
  }) {
    return this.prisma.lesson.create({
      data: { ...data, courseId },
    });
  }
  async getSubCourses(parentId: string) {
  return this.prisma.course.findMany({
    where: { parentId },
    include: { lessons: true },
  });
}
async addChapter(courseId: string, data: { title: string; position: number }) {
  return this.prisma.chapter.create({
    data: { ...data, courseId },
  });
}

async updateChapter(chapterId: string, data: { title?: string; position?: number }) {
  return this.prisma.chapter.update({
    where: { id: chapterId },
    data,
  });
}

async deleteChapter(chapterId: string) {
  // احذف الدروس أول
  const lessons = await this.prisma.lesson.findMany({
    where: { chapterId },
  });

  for (const lesson of lessons) {
    await this.prisma.comment.deleteMany({
      where: { lessonId: lesson.id },
    });
  }

  await this.prisma.lesson.deleteMany({ where: { chapterId } });
  return this.prisma.chapter.delete({ where: { id: chapterId } });
}

async addLessonToChapter(chapterId: string, courseId: string, data: {
  title: string;
  position: number;
}) {
  return this.prisma.lesson.create({
    data: { ...data, courseId, chapterId },
  });
}
async update(id: string, data: Partial<{
  title: string;
  description: string;
  price: number;
  level: string;
  isPublished: boolean;
  thumbnail: string;
  previewUrl: string;
  comingSoon: boolean;
  hasLevels: boolean;
}>) {
  return this.prisma.course.update({
    where: { id },
    data,
  });
}
async markComplete(userId: string, lessonId: string) {
  return this.prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { id: require('crypto').randomUUID(), userId, lessonId },
    update: { completedAt: new Date() },
  });
}

async markIncomplete(userId: string, lessonId: string) {
  return this.prisma.progress.deleteMany({
    where: { userId, lessonId },
  });
}

async getProgress(userId: string, courseId: string) {
  return this.prisma.progress.findMany({
    where: {
      userId,
      lesson: { courseId },
    },
    select: { lessonId: true },
  });
}
}
