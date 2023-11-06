import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthenticationRequest, IAuthenticate } from './auth.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Role } from 'src/user/entities/role.enum';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private logger: Logger,
  ) {}

  /**
   * Authenticate user with email and password and return user and access token
   * @param authCredentialsDto - email and password
   * @returns User and access token
   */
  async authenticateUser(
    authCredentialsDto: AuthenticationRequest,
  ): Promise<IAuthenticate> {
    const { email, password } = authCredentialsDto;

    this.logger.log('Validating user...');
    const user = await this.validateUser({ email } as JwtPayload);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      this.logger.log('Generating key...');
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '1d',
        secret: 'secrete',
      });
      this.logger.log('Key generated successfully');
      const newUser = this.mapUserToUserResponseDto(user);

      return { newUser, accessToken } as unknown as IAuthenticate;
    } else {
      this.logger.warn('Invalid login credentials');
      throw new UnauthorizedException('Invalid login credentials');
    }
  }

  /**
   * Check if user exists, or throw an error if the user does not exist
   * @param payload - JWT payload
   * @returns User
   */
  async validateUser(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.userRepository.findOne({
      where: { email },
    } as FindOneOptions<User>);
    if (!user) {
      this.logger.warn('User does not exist');
      throw new UnauthorizedException('User does not exist');
    }
    this.logger.log('User validated successfully');
    return user;
  }

  /**
   * Register a new user and return the user and access token
   * @param regCredentialsDto - email, password, firstName, lastName, role
   * @returns User and access token
   */
  async registerUser(regCredentialsDto: CreateUserDto): Promise<IAuthenticate> {
    const { email, password, firstName, lastName, role } = regCredentialsDto;
    const userExists = await this.verifyUser({ email } as JwtPayload);
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }
    const newUser = new User();
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.role = role || Role.Customer; // Set a default role if not provided

    newUser.password = await bcrypt.hash(password, 10);

    await this.userRepository.save(newUser);
    this.logger.log('User registered successfully');
    return this.authenticateUser({ email, password } as AuthenticationRequest);
  }

  /**
   * Check if a user is already registered
   * @param payload - JWT payload
   * @returns true if the user does not exist
   */
  async verifyUser(payload: JwtPayload): Promise<boolean> {
    const { email } = payload;
    const user = await this.userRepository.findOne({
      where: { email },
    } as FindOneOptions<User>);
    if (!user) {
      this.logger.log('User does not exist');
      return false;
    }
    return true;
  }

  /**
   * Refresh access token
   * @param refreshToken - refresh token
   * @returns User and access token
   */
  async refreshToken(refreshToken: string): Promise<IAuthenticate> {
    const payload = this.jwtService.verify(refreshToken);
    const user = await this.validateUser(payload);
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });
    return { user, accessToken } as IAuthenticate;
  }

  /**
   * This method is used to return user details in the response without the password
   * @param user T
   * @returns  UserResponseDto
   */
  private mapUserToUserResponseDto(user: User): UserResponseDto {
    const { id, email, firstName, lastName, role } = user;
    return { id, email, firstName, lastName, role };
  }
}
