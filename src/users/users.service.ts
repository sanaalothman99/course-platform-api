import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
async findByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      role: true,
      deviceId: true,
    },
  });
}

  async create(data: { email: string; password: string; name: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  async findAll() {
  return this.prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}
async updateDeviceId(userId: string, deviceId: string) {
  return this.prisma.user.update({
    where: { id: userId },
    data: { deviceId },
  });
}

async resetDeviceId(userId: string) {
  return this.prisma.user.update({
    where: { id: userId },
    data: { deviceId: null },
  });
}
}
