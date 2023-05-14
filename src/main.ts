// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { BusinessErrorFilter } from './errors/businessError';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const APP_PORT = process.env.APP_PORT;

async function main() {
  const app = await NestFactory.create(AppModule, {});

  app.use(bodyParser.json({ limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new BusinessErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('swagger')
    .setDescription('sensor`s api documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(APP_PORT);
  Logger.log(`Server has been started at ${APP_PORT} port!`);
}

main();
