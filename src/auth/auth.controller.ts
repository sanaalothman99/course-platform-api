import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  register(
    @Body() body: { email: string; password: string; name: string },
  ) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string; deviceId?: string }) {
    return this.authService.login(body.email, body.password, body.deviceId);
  }

  @Post('reset-device')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  resetDevice(@Body() body: { userId: string }) {
    return this.usersService.resetDeviceId(body.userId);
  }
}