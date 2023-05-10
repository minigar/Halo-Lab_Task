import { Module } from '@nestjs/common';
import { DatabaseModule } from './data/database.module';
import { ControllersModule } from './controllers/controllers.module';
import { ServiceModule } from './service/services.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    DatabaseModule,
    ControllersModule,
    ServiceModule,
    ConfigModule,
  ],
})
export class AppModule {}
