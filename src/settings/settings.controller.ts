import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings()
  }

  @Put('maintenance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  setMaintenance(@Body() body: { maintenanceMode: boolean }) {
    return this.settingsService.setMaintenanceMode(body.maintenanceMode)
  }
}