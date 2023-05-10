import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../data/database.module';
import { ServiceModule } from 'src/service/services.module';
import { HealthController } from './health.controller';
import { SensorController } from './sensor.controller';

@Module({
  imports: [ConfigModule, DatabaseModule, ServiceModule],
  controllers: [HealthController, SensorController],
})
export class ControllersModule {}
