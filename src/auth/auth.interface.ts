import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export interface IAuthenticate {
  user: UserResponseDto;
  accessToken: string;
}

export class AuthenticationRequest {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the user',
  })
  @IsString()
  @Length(6, 20)
  readonly password: string;
}
