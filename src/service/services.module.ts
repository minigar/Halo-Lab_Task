import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/data/database.module';
import { SimulationService } from './simulation.service';
import { SensorService } from './sensor.service';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.SENSOR_QUEUE,
      redis: { host: '0.0.0.0', port: 6379 },
    }),
    ConfigModule,
    DatabaseModule,
  ],
  providers: [SimulationService, SensorService, QueueService],
  exports: [SimulationService, SensorService, QueueService],
})
export class ServiceModule implements OnModuleInit {
  constructor(
    private readonly simulationService: SimulationService,
    private readonly queueService: QueueService,
  ) {}
  async onModuleInit() {
    await this.simulationService.generateOnStart();
    await this.queueService.add(
      await this.simulationService.updateSensorsByFrequency(),
    );
  }
}
