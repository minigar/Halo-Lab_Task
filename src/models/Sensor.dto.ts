import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SensorRequest {
  @ApiProperty({ example: 'Alpha1' })
  @IsNotEmpty()
  codeName: string;
}

export class SensorResponse {
  @ApiProperty({ examples: { example1: { statusCode: 200, data: 10 } } })
  data: number;
}
