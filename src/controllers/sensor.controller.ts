import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { successResponse } from 'src/helpers/success-response';
import { SensorService } from '../service/sensor.service';

@Controller()
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get('group/:groupName/temperature/average')
  async groupAverageTemperature(@Param('groupName') groupName: string) {
    return successResponse(
      await this.sensorService.groupAverageTemperature(groupName),
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
    @Param('N', ParseIntPipe) N: number,
  ) {
    return successResponse(
      await this.sensorService.groupTopSpecies(groupName, N),
    );
  }

  @Get('/region/temperature/min')
  async regionMinTemperature(
    @Query('xMin', ParseIntPipe) xMin: number,
    @Query('xMax', ParseIntPipe) xMax: number,
    @Query('yMin', ParseIntPipe) yMin: number,
    @Query('yMax', ParseIntPipe) yMax: number,
    @Query('zMin', ParseIntPipe) zMin: number,
    @Query('zMax', ParseIntPipe) zMax: number,
  ) {
    return successResponse(
      await this.sensorService.regionMinTemperature({
        xMin,
        xMax,
        yMin,
        yMax,
        zMin,
        zMax,
      }),
    );
  }

  @Get('/region/temperature/max')
  async regionMaxTemperature(
    @Query('xMin', ParseIntPipe) xMin: number,
    @Query('xMax', ParseIntPipe) xMax: number,
    @Query('yMin', ParseIntPipe) yMin: number,
    @Query('yMax', ParseIntPipe) yMax: number,
    @Query('zMin', ParseIntPipe) zMin: number,
    @Query('zMax', ParseIntPipe) zMax: number,
  ) {
    return successResponse(
      await this.sensorService.regionMaxTemperature({
        xMin,
        xMax,
        yMin,
        yMax,
        zMin,
        zMax,
      }),
    );
  }

  @Get(':codeName/temperature/average')
  async sensorAverageByDate(
    @Param('codeName') codeName: string,
    @Query('from', ParseIntPipe) fromDateTime: number,
    @Query('till', ParseIntPipe) tillDateTime: number,
  ) {
    return successResponse(
      await this.sensorService.senorAverageByDate(
        codeName,
        fromDateTime,
        tillDateTime,
      ),
    );
  }
}
