import { ApiProperty } from '@nestjs/swagger';

export class CreateParkingSpaceDto {
  @ApiProperty({ example: 'A1', description: 'The parking space number' })
  parkingNumber: string;

  @ApiProperty({
    example: 1,
    description: 'The floor where the parking space is located',
  })
  floor: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if the parking space is available',
  })
  isAvailable: boolean;

  @ApiProperty({
    example: 60,
    description: 'The time of occupation in minutes',
  })
  occupationTime: number;
}
