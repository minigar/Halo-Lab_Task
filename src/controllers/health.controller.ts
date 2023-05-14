import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  @ApiTags('Check health')
  @Get()
  @HealthCheck()
  health() {
    return { status: 'ok' };
  }
}
