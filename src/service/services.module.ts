import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/data/database.module';
import { BullModule } from '@nestjs/bull';
import { SimulationService } from './simulation.service';
import { SensorService } from './sensor.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.SENSOR_QUEUE,
    }),
    ConfigModule,
    DatabaseModule,
  ],
  providers: [SimulationService, SensorService],
  exports: [SimulationService, SensorService],
})
export class ServiceModule implements OnModuleInit {
  constructor(private readonly simulationService: SimulationService) {
    this.simulationService.generateOnStart();
  }
  async onModuleInit() {
    setInterval(
      async () => await this.simulationService.updateSensorsByFrequency(),
      100,
    );
  }
}
