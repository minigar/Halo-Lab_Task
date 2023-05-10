import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/data/database.service';

@Injectable()
export class SensorService {
  constructor(private readonly db: DatabaseService) {}

  async average() {
    return 0;
  }
}
