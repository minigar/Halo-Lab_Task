import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SimulationService } from 'src/service/simulation.service';

@Processor('sensor')
export class SensorProcessor {
  private readonly logger = new Logger(SensorProcessor.name);

  constructor(private readonly simulationService: SimulationService) {}

  @Process()
  async updateSensorJob(job: Job): Promise<void> {
    this.logger.debug('Processing update sensor job', job.id);
    const sensorId = job.data.sensorId;
    await this.simulationService.updateSensor(sensorId);
  }
}
