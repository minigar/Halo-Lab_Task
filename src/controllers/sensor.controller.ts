import { Controller, Get } from '@nestjs/common';
import { successResponse } from 'src/helpers/success-response';
import { SensorService } from '../service/sensor.service';

@Controller()
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get('sensor/:codeName/temperature/average')
  async average() {
    return successResponse(await this.sensorService.average());
  }
}
