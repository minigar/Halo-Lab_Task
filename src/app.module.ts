import { Module } from '@nestjs/common';
import { DatabaseModule } from './data/database.module';
import { ControllersModule } from './controllers/controllers.module';
import { ServiceModule } from './service/services.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, ControllersModule, ServiceModule, ConfigModule],
})
export class AppModule {}
