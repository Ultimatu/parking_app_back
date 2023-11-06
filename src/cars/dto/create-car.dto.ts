import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({
    example: '123456789',
    description: 'The IMMA of the car',
  })
  @IsNotEmpty()
  @IsString()
  readonly imma: string;

  @ApiProperty({
    example: 'BMW',
    description: 'The brand of the car',
  })
  @IsNotEmpty()
  @IsString()
  readonly brand: string;

  @ApiProperty({
    example: 'red',
    description: 'The color of the car',
  })
  @IsNotEmpty()
  @IsString()
  readonly color: string;

  @ApiProperty({
    example: '1',
    description: 'The car owner ID',
  })
  @IsNotEmpty()
  @IsInt()
  readonly ownerId: number;
}
