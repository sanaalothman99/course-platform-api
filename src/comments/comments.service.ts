import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls:{
    rejectUnauthorized:false,
  },
});

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(userId: string, lessonId: string, content: string) {
    const comment = await this.prisma.comment.create({
      data: { userId, lessonId, content },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // إرسال إيميل لصاحب الموقع
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'Atoz96automation@gmail.com',
      subject: '💬 New Comment on A to Z Automation',
      html: `
        <h2>New Comment!</h2>
        <p><strong>From:</strong> ${comment.user.name} (${comment.user.email})</p>
        <p><strong>Comment:</strong> ${content}</p>
        <p><strong>Lesson ID:</strong> ${lessonId}</p>
        <br/>
        <p>Login to admin panel to reply.</p>
      `,
    });

    return comment;
  }

  async replyToComment(adminId: string, lessonId: string, content: string, parentId: string) {
    const reply = await this.prisma.comment.create({
      data: { userId: adminId, lessonId, content, parentId },
      include: {
        user: { select: { name: true } },
        parent: {
          include: {
            user: { select: { email: true, name: true } },
          },
        },
      },
    });

    // إرسال إيميل للطالب
    if (reply.parent?.user?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: reply.parent.user.email,
        subject: '✅ Reply to your comment — A to Z Automation',
        html: `
          <h2>You have a new reply!</h2>
          <p><strong>From:</strong> A to Z Automation Team</p>
          <p><strong>Reply:</strong> ${content}</p>
          <br/>
          <p>Login to your account to see the full conversation.</p>
        `,
      });
    }

    return reply;
  }

  async getLessonComments(lessonId: string) {
    return this.prisma.comment.findMany({
      where: { lessonId, parentId: null },
      include: {
        user: { select: { name: true, role: true } },
        replies: {
          include: {
            user: { select: { name: true, role: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllComments() {
    return this.prisma.comment.findMany({
      where: { parentId: null },
      include: {
        user: { select: { name: true, email: true } },
        lesson: { select: { title: true } },
        replies: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
