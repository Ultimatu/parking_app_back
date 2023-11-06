import {
  Controller,
  Post,
  Body,
  Res,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationRequest } from './auth.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IAuthenticate } from './auth.interface';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GuestGuard } from './guards/guest.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('authenticate')
  @UseGuards(GuestGuard)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({
    status: 201,
    description: 'User authenticated',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                },
                email: {
                  type: 'string',
                },
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                role: {
                  type: 'string',
                },
              },
            },
            accessToken: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: AuthenticationRequest })
  async login(
    @Body() authCredentialsDto: AuthenticationRequest,
    @Res() res,
  ): Promise<IAuthenticate> {
    try {
      const result =
        await this.authService.authenticateUser(authCredentialsDto);
      Logger.log('returning response...');
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('register')
  @UseGuards(GuestGuard)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                },
                email: {
                  type: 'string',
                },
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                role: {
                  type: 'string',
                },
              },
            },
            accessToken: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateUserDto })
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() res,
  ): Promise<IAuthenticate> {
    try {
      const result = await this.authService.registerUser(createUserDto);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  // @Post('refresh')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Refresh access token' })
  // @ApiBearerAuth()
  // @ApiResponse({
  //   status: 201,
  //   description: 'Token refreshed',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           user: {
  //             type: 'object',
  //             properties: {
  //               id: {
  //                 type: 'number',
  //               },
  //               email: {
  //                 type: 'string',
  //               },
  //               firstName: {
  //                 type: 'string',
  //               },
  //               lastName: {
  //                 type: 'string',
  //               },
  //               role: {
  //                 type: 'string',
  //               },
  //             },
  //           },
  //           accessToken: {
  //             type: 'string',
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // async refresh(
  //   @Body() refreshToken: string,
  //   @Res() res,
  // ): Promise<IAuthenticate> {
  //   try {
  //     const result = await this.authService.refreshToken(refreshToken);
  //     return res.status(HttpStatus.CREATED).json(result);
  //   } catch (error) {
  //     return res
  //       .status(HttpStatus.BAD_REQUEST)
  //       .json({ message: error.message });
  //   }
  // }
}
