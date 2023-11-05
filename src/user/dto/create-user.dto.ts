import { IsNotEmpty, IsEmail, IsString, Length, IsEnum } from 'class-validator';
import { Role } from '../entities/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the user',
  })
  @IsString()
  @Length(6, 20)
  password: string;

  @ApiProperty({
    example: 'customer',
    enum: Role,
    description: 'The role of the user',
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
