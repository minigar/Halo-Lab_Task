import { Controller, Get, Param } from '@nestjs/common';
import { successResponse } from 'src/helpers/success-response';
import { SensorService } from '../service/sensor.service';

@Controller()
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get('sensor/:codeName/temperature/average')
  async sensorAverageTemperature(@Param('codeName') codeName: string) {
    return successResponse(
      await this.sensorService.groupAverageTemperature(codeName),
    );
  }

  @Get('/group/:groupName/transparency/average')
  async groupAverageTransparency(@Param('groupName') groupName: string) {
    return successResponse(
      await this.sensorService.groupAverageTransparency(groupName),
    );
  }

  @Get('/group/:groupName/species')
  async groupSpecies(@Param('groupName') groupName: string) {
    return successResponse(await this.sensorService.groupSpecies(groupName));
  }

  @Get('/group/:groupName/species/:N')
  async groupTopSpecies(
    @Param('groupName') groupName: string,
    @Param('N') N: number,
  ) {
    return successResponse(
      await this.sensorService.groupTopSpecies(groupName, N),
    );
  }

  @Get('/region/temperature/min')
  async regionMinTemperature() {
    return successResponse(await this.sensorService.regionMinTemperature());
  }

  @Get('/region/temperature/max')
  async regionMaxTemperature() {
    return successResponse(await this.sensorService.regionMaxTemperature());
  }

  @Get('/sensor/:codeName/temperature/average')
  async senorAverageByDate(@Param('codeName') codeName: string) {
    return successResponse(
      await this.sensorService.senorAverageByDate(codeName),
    );
  }
}
