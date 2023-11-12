import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthenticationRequest } from './auth.interface';
import { IAuthenticate } from './auth.interface';
import { HttpStatus, Logger } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        Logger,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an authenticated user', async () => {
      const authCredentialsDto: AuthenticationRequest = {
        email: 'test@example.com',
        password: 'password',
      };
      const result: IAuthenticate = {
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'user',
        },
        accessToken: 'access_token',
      };
      jest.spyOn(service, 'authenticateUser').mockResolvedValue(result);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const response = await controller.login(authCredentialsDto, res);

      expect(service.authenticateUser).toHaveBeenCalledWith(authCredentialsDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(result);
      expect(response).toEqual(result);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const authCredentialsDto: AuthenticationRequest = {
        email: 'test@example.com',
        password: 'password',
      };
      const error = new Error('Invalid input');
      jest.spyOn(service, 'authenticateUser').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.login(authCredentialsDto, res);

      expect(service.authenticateUser).toHaveBeenCalledWith(authCredentialsDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };
      const result: IAuthenticate = {
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'customer',
        },
        accessToken: 'access_token',
      };
      jest.spyOn(service, 'registerUser').mockResolvedValue(result);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const response = await controller.register(createUserDto, res);

      expect(service.registerUser).toHaveBeenCalledWith(createUserDto, false);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(result);
      expect(response).toEqual(result);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };
      const error = new Error('Invalid input');
      jest.spyOn(service, 'registerUser').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.register(createUserDto, res);

      expect(service.registerUser).toHaveBeenCalledWith(createUserDto, false);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('registerAdmin', () => {
    it('should register a new admin', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };
      const result: IAuthenticate = {
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'customer',
        },
        accessToken: 'access_token',
      };
      jest.spyOn(service, 'registerUser').mockResolvedValue(result);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const response = await controller.registerAdmin(createUserDto, res);

      expect(service.registerUser).toHaveBeenCalledWith(createUserDto, true);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(result);
      expect(response).toEqual(result);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };
      const error = new Error('Invalid input');
      jest.spyOn(service, 'registerUser').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.registerAdmin(createUserDto, res);

      expect(service.registerUser).toHaveBeenCalledWith(createUserDto, true);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});
