import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';

describe('CarsController', () => {
  let controller: CarsController;
  let service: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [CarsService],
    }).compile();

    controller = module.get<CarsController>(CarsController);
    service = module.get<CarsService>(CarsService);
  });

  describe('createCar', () => {
    it('should create a new car', async () => {
      const createCarDto: CreateCarDto = {
        imma: 'ABC123',
        brand: 'Toyota',
        color: 'Red',
        ownerId: 1,
      };
      const car: Car = {
        id: 1,
        imma: 'ABC123',
        brand: 'Toyota',
        color: 'Red',
        owner: new User(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(car);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.createCar(createCarDto, res);

      expect(service.create).toHaveBeenCalledWith(createCarDto);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(car);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const createCarDto: CreateCarDto = {
        imma: 'ABC123',
        brand: 'Toyota',
        color: 'Red',
        ownerId: 1,
      };
      const error = new Error('Invalid input');
      jest.spyOn(service, 'create').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.createCar(createCarDto, res);

      expect(service.create).toHaveBeenCalledWith(createCarDto);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getAllCars', () => {
    it('should return all cars', async () => {
      const cars: Car[] = [
        {
          id: 1,
          imma: 'ABC123',
          brand: 'Toyota',
          color: 'Red',
          owner: new User(),
        },
        {
          id: 2,
          imma: 'DEF456',
          brand: 'Honda',
          color: 'Blue',
          owner: new User(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(cars);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAllCars(res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cars);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const error = new Error('Invalid input');
      jest.spyOn(service, 'findAll').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAllCars(res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getCarById', () => {
    it('should return a car by ID', async () => {
      const id = 1;
      const car: Car = {
        id: 1,
        imma: 'ABC123',
        brand: 'Toyota',
        color: 'Red',
        owner: new User(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(car);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getCarById(id, res);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(car);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const id = 1;
      const error = new Error('Invalid input');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getCarById(id, res);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('updateCarById', () => {
    it('should update a car by ID', async () => {
      const id = 1;
      const updateCarDto: UpdateCarDto = {
        brand: 'Toyota',
        color: 'Blue',
        ownerId: 1,
      };
      const car: Car = {
        id: 1,
        imma: 'ABC123',
        brand: 'Toyota',
        color: 'Blue',
        owner: new User(),
      };
      jest.spyOn(service, 'update').mockResolvedValue(car);

      //   const res = {
      //     status: jest.fn().mockReturnThis(),
      //     json: jest.fn(),
      //   } as unknown as Response;

      const result = await controller.updateCarById(id, updateCarDto);

      expect(service.update).toHaveBeenCalledWith(id, updateCarDto);
      expect(result).toEqual(car);
    });
  });

  describe('deleteCarById', () => {
    it('should delete a car by ID', async () => {
      const id = 1;
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.deleteCarById(id, res);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith();
    });

    it('should return a 400 error if the service throws an error', async () => {
      const id = 1;
      const error = new Error('Invalid input');
      jest.spyOn(service, 'remove').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.deleteCarById(id, res);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getCarsByUserId', () => {
    it('should return cars associated with a user', async () => {
      const id = 1;
      const cars: Car[] = [
        {
          id: 1,
          imma: 'ABC123',
          brand: 'Toyota',
          color: 'Red',
          owner: new User(),
        },
        {
          id: 2,
          imma: 'DEF456',
          brand: 'Honda',
          color: 'Blue',
          owner: new User(),
        },
      ];
      jest.spyOn(service, 'getUserCars').mockResolvedValue(cars);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getCarsByUserId(id, res);

      expect(service.getUserCars).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cars);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const id = 1;
      const error = new Error('Invalid input');
      jest.spyOn(service, 'getUserCars').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getCarsByUserId(id, res);

      expect(service.getUserCars).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});
