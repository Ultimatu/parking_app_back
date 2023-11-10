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
    example: '08:00:00',
    description: 'The open time of the parking space',
  })
  openTime: string;

  @ApiProperty({
    example: '18:00:00',
    description: 'The close time of the parking space',
  })
  closeTime: string;

  @ApiProperty({
    example: 'Rua do Ouro, 1000-001 Lisboa',
    description: 'The address of the parking space',
  })
  address: string;
}
