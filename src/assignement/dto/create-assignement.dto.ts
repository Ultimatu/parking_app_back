import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user associated with the assignment',
  })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the parking space associated with the assignment',
  })
  parkingSpaceId: number;

  @ApiProperty({
    example: 1,
    description:
      'The floor number of the parking space associated with the assignment',
  })
  floorNumber: number;

  @ApiProperty({
    example: '2021-01-01',
    description: 'The date of the assignment',
  })
  assDate: string;
}
