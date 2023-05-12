import { IsNotEmpty, IsNumberString } from 'class-validator';

export class Fish {
  type: string;
  count: number;
}

export class AxisType {
  @IsNotEmpty()
  @IsNumberString()
  xMin: number;

  @IsNotEmpty()
  @IsNumberString()
  xMax: number;

  @IsNotEmpty()
  @IsNumberString()
  yMin: number;

  @IsNotEmpty()
  @IsNumberString()
  yMax: number;

  @IsNotEmpty()
  @IsNumberString()
  zMin: number;

  @IsNotEmpty()
  @IsNumberString()
  zMax: number;
}

export interface AverageTemperature {
  groupName: string;
  temperature: number;
  sensorsAmount: number;
}

export interface AverageTransparency {
  groupName: string;
  transparency: number;
  sensorsAmount: number;
}
