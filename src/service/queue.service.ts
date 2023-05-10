import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(process.env.SENSOR_QUEUE) private readonly queue: Queue,
  ) {}

  async add(data: any): Promise<void> {
    await this.queue.add(data);
  }
}
