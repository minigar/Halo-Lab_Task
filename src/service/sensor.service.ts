import { Injectable } from '@nestjs/common';
import { SensorErrorKey } from 'src/controllers/errorKeys/SensorErrorKey';
import { DatabaseService } from 'src/data/database.service';
import { BusinessError } from 'src/errors/businessError';

@Injectable()
export class SensorService {
  constructor(private readonly db: DatabaseService) {}

  async groupAverageTemperature(groupName: string): Promise<{
    groupName: string;
    temperature: number;
    sensorsAmount: number;
  }> {
    const group = await this.db.group.findUnique({
      where: { name: groupName },
      include: { sensors: true, _count: true },
    });

    if (!group) {
      throw new BusinessError(SensorErrorKey.GROUP_NOT_EXIST);
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

  async groupAverageTransparency(groupName: string): Promise<{
    groupName: string;
    transparency: number;
    sensorsAmount: number;
  }> {
    const group = await this.db.group.findUnique({
      where: { name: groupName },
      include: { sensors: true, _count: true },
    });

    if (!group) {
      throw new BusinessError(SensorErrorKey.GROUP_NOT_EXIST);
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

  async groupSpecies(
    groupName: string,
  ): Promise<{ type: string; count: number }[]> {
    const group = await this.db.group.findUnique({
      where: { name: groupName },
      select: { name: true, _count: true },
    });

    if (!group) {
      throw new BusinessError(SensorErrorKey.GROUP_NOT_EXIST);
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

  async groupTopSpecies(
    groupName: string,
    topN: number,
  ): Promise<{ type: string; count: number }[]> {
    const group = await this.db.group.findUnique({
      where: { name: groupName },
      select: { name: true, _count: true },
    });

    if (!group) {
      throw new BusinessError(SensorErrorKey.GROUP_NOT_EXIST);
    }

    const sensors = await this.db.sensor.findMany({
      where: {
        group: { name: groupName },
      },
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

  async regionMinTemperature() {
    return 0;
  }

  async regionMaxTemperature() {
    return 0;
  }

  async senorAverageByDate(codeName: string) {
    return 0;
  }
}
