import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Sensor } from '@prisma/client';
import { Queue } from 'bull';
import { DatabaseService } from 'src/data/database.service';

@Injectable()
@Processor(process.env.SENSOR_QUEUE)
export class SimulationService {
  constructor(
    @InjectQueue(process.env.SENSOR_QUEUE) private sensorQueue: Queue,
    private readonly db: DatabaseService,
  ) {}

  async generateOnStart() {
    await this.db.sensor.deleteMany();
    await this.db.group.deleteMany();
    await this.db.fish.deleteMany();

    const greekLetters = [
      'Alpha',
      'Beta',
      'Gamma',
      'Delta',
      'Epsilon',
      'Zeta',
      'Eta',
      'Theta',
      'Iota',
      'Kappa',
    ];

    for (let i = 0; i < greekLetters.length; i++) {
      const groupName = greekLetters[i];

      await this.db.group.create({ data: { name: groupName } });

      for (let j = 1; j <= 2; j++) {
        const sensorName = `${groupName}${j}`;
        const group = await this.db.group.findUnique({
          where: { name: groupName },
        });

        await this.db.sensor.create({
          data: {
            codename: sensorName,
            groupId: group.id,
            frequency: Math.floor(Math.random() * 20 + 1),
            transparency: Math.floor(Math.random() * 100),
          },
        });
      }
    }
  }

  @Process()
  async updateSensorsByFrequency() {
    const sensors = await this.db.sensor.findMany();

    sensors.sort((a, b) => a.x - b.x); // sort by x-axis

    const transparencyThreshold = 10;

    for (let i = 0; i < sensors.length; i++) {
      const currSensor = sensors[i];
      const prevSensor = sensors[i - 1];
      const frequencyInMs = currSensor.frequency * 1000; // convert to ms

      if (prevSensor) {
        const transparencyDiff = Math.abs(
          currSensor.transparency - prevSensor.transparency,
        );

        if (transparencyDiff > transparencyThreshold) {
          const newTransparency = Math.floor(
            (currSensor.transparency + prevSensor.transparency) / 2, // average by 2 neighbours
          );

          await this.db.sensor.update({
            where: { id: currSensor.id },
            data: { transparency: newTransparency },
          });

          await this.db.sensor.update({
            where: { id: prevSensor.id },
            data: { transparency: newTransparency },
          });
        }
      }

      const diff =
        new Date().getTime() - new Date(currSensor.lastUpdated).getTime();

      const checkLastUpdate = !currSensor.lastUpdated || diff >= frequencyInMs;

      if (checkLastUpdate) {
        const updatedSensor = await this.updateSensor(currSensor);

        await this.db.sensor.update({
          where: { id: updatedSensor.id },
          data: { lastUpdated: new Date() },
        });
      }
    }
  }

  async updateSensor(sensor: Sensor) {
    return await this.db.sensor.update({
      where: { id: sensor.id },
      data: {
        x: Number((Math.random() * 100).toFixed(1)),
        y: Number((Math.random() * 100).toFixed(1)),
        z: Number((Math.random() * 1000).toFixed(1)),
        transparency: Math.floor(Math.random() * 100),
        temperature:
          sensor.z > 500
            ? Math.floor(Math.random() * 10) + 15
            : Math.floor(Math.random() * 10) + 10,
      },
    });
  }
}
