import { Injectable } from '@nestjs/common';
import {
  DateTimeErrorKey,
  GroupErrorKey,
  SensorErrorKey,
} from 'src/controllers/errorKeys/TaskErrorKey';
import { DatabaseService } from 'src/data/database.service';
import { BusinessError } from 'src/errors/businessError';
import {
  AverageTemperature,
  AverageTransparency,
  AxisType,
  Fish,
} from 'src/models/Task.dto';

@Injectable()
export class SensorService {
  constructor(private readonly db: DatabaseService) {}

  async groupAverageTemperature(
    groupName: string,
  ): Promise<AverageTemperature> {
    const group = await this.db.group.findUnique({
      where: { name: groupName },
      include: { sensors: true, _count: true },
    });

    if (!group) {
      throw new BusinessError(GroupErrorKey.GROUP_NOT_EXIST);
    }

    const sensors = group.sensors;

    const temperatureSum = sensors.reduce(
      (sum, sensor) => sum + sensor.temperature,
      0,
    );

    const temperatureAverage = temperatureSum / sensors.length;
    return {
      groupName,
      temperature: temperatureAverage,
      sensorsAmount: group._count.sensors,
    };
  }

  async groupAverageTransparency(
    groupName: string,
  ): Promise<AverageTransparency> {
    const group = await this.db.group.findUnique({
      where: { name: groupName },
      include: { sensors: true, _count: true },
    });

    if (!group) {
      throw new BusinessError(GroupErrorKey.GROUP_NOT_EXIST);
    }

    const sensors = group.sensors;

    const transparencySum = sensors.reduce(
      (sum, sensor) => sum + sensor.transparency,
      0,
    );
    const transparencyAverage = transparencySum / sensors.length;
    return {
      groupName,
      transparency: transparencyAverage,
      sensorsAmount: group._count.sensors,
    };
  }

  async groupSpecies(groupName: string): Promise<Fish[]> {
    const group = await this.db.group.findUnique({
      where: { name: groupName },
      select: { name: true, _count: true },
    });

    if (!group) {
      throw new BusinessError(GroupErrorKey.GROUP_NOT_EXIST);
    }

    const sensors = await this.db.sensor.findMany({
      where: {
        group: { name: groupName },
      },
      include: {
        fishes: true,
      },
    });

    const fishMap = new Map<string, number>();

    sensors.forEach((sensor) => {
      sensor.fishes.forEach((fish) => {
        const count = fishMap.get(fish.type) || 0;
        fishMap.set(fish.type, count + fish.count);
      });
    });

    return Array.from(fishMap.entries()).map(([type, count]) => ({
      type,
      count,
    }));
  }

  async groupTopSpecies(groupName: string, topN: number): Promise<Fish[]> {
    const group = await this.db.group.findUnique({
      where: { name: groupName },
      select: { name: true },
    });

    if (!group) {
      throw new BusinessError(GroupErrorKey.GROUP_NOT_EXIST);
    }

    const sensors = await this.db.sensor.findMany({
      where: { group: { name: groupName } },
      include: {
        fishes: true,
      },
    });

    const fishesMap = new Map<string, number>();

    sensors.forEach((sensor) => {
      sensor.fishes.forEach((fishes) => {
        const count = fishesMap.get(fishes.type) || 0;
        fishesMap.set(fishes.type, count + fishes.count);
      });
    });

    return Array.from(fishesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([type, count]) => ({ type, count }));
  }

  async regionMinTemperature(payload: AxisType): Promise<number> {
    const sensor = await this.db.sensor.findFirst({
      where: {
        x: { gte: payload.xMin, lte: payload.xMax },
        y: { gte: payload.yMin, lte: payload.yMax },
        z: { gte: payload.zMin, lte: payload.zMax },
      },
      orderBy: {
        temperature: 'asc',
      },
      select: {
        temperature: true,
      },
    });

    return sensor?.temperature ?? 0;
  }

  async regionMaxTemperature(payload: AxisType): Promise<number> {
    const sensor = await this.db.sensor.findFirst({
      where: {
        x: { gte: payload.xMin, lte: payload.xMax },
        y: { gte: payload.yMin, lte: payload.yMax },
        z: { gte: payload.zMin, lte: payload.zMax },
      },
      orderBy: {
        temperature: 'desc',
      },
      select: {
        temperature: true,
      },
    });

    return sensor?.temperature ?? 0;
  }

  async senorAverageByDate(
    codeName: string,
    fromDateTime: number,
    untillDateTime: number,
  ): Promise<number> {
    let from: Date;
    let till: Date;

    if (fromDateTime) from = new Date(fromDateTime);

    if (fromDateTime && fromDateTime < 0) {
      throw new BusinessError(DateTimeErrorKey.BAD_TIME_REQUEST);
    }

    if (fromDateTime) till = new Date(untillDateTime);

    if (untillDateTime && untillDateTime < 0) {
      throw new BusinessError(DateTimeErrorKey.BAD_TIME_REQUEST);
    }

    const sensor = await this.db.sensor.findFirst({
      where: {
        codename: codeName,
      },
      include: {
        updates: {
          orderBy: { createdAt: 'asc' },
          select: { temperature: true, createdAt: true },
          where: {
            createdAt: {
              gte: from,
              lte: till,
            },
          },
        },
      },
    });

    if (!sensor) {
      throw new BusinessError(SensorErrorKey.SENSOR_NOT_EXIST);
    }

    if (!sensor.updates.length) {
      throw new BusinessError(
        `Updates from ${from.getUTCDate()} till ${till} NOT found!`,
      );
    }

    const updates = sensor.updates;

    let averageTemperature = 0;
    for (let i = 0; i < updates.length; i++) {
      averageTemperature += updates[i].temperature;
    }

    return Number((averageTemperature / updates.length).toFixed(1));
  }
}
