import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { OrdersModule } from './orders/orders.module';
import { UploadModule } from './upload/upload.module';
import { CommentsModule } from './comments/comments.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, CoursesModule, OrdersModule, UploadModule, CommentsModule, ContactModule],
})
export class AppModule {}