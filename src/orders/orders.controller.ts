import { Controller, Get, Post, Body, Param, UseGuards, Request, Req, Headers } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  createCheckout(@Request() req: any, @Body() body: { courseId: string }) {
    return this.ordersService.createCheckoutSession(req.user.id, body.courseId);
  }

  @Post('webhook')
  handleWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.ordersService.handleWebhook(req.rawBody, signature);
  }

  @Get('my-courses')
  @UseGuards(JwtAuthGuard)
  getUserOrders(@Request() req: any) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @Get('check/:courseId')
  @UseGuards(JwtAuthGuard)
  checkEnrollment(@Request() req: any, @Param('courseId') courseId: string) {
    return this.ordersService.checkEnrollment(req.user.id, courseId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }
  @Post('grant-access')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
grantAccess(@Body() body: { userId: string; courseId: string }) {
  return this.ordersService.grantAccess(body.userId, body.courseId);
}
@Post('certificate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
uploadCertificate(@Body() body: { userId: string; courseId: string; certificateUrl: string }) {
  return this.ordersService.uploadCertificate(body.userId, body.courseId, body.certificateUrl);
}

@Get('certificates')
@UseGuards(JwtAuthGuard)
getUserCertificates(@Request() req: any) {
  return this.ordersService.getUserCertificates(req.user.id);
}

@Get('completed-students/:courseId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
getCompletedStudents(@Param('courseId') courseId: string) {
  return this.ordersService.getCompletedStudents(courseId);
}
}