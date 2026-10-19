import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    return this.prisma.settings.findUnique({ where: { id: 'main' } })
  }

  async setMaintenanceMode(value: boolean) {
    return this.prisma.settings.upsert({
      where: { id: 'main' },
      update: { maintenanceMode: value },
      create: { id: 'main', maintenanceMode: value },
    })
  }
}