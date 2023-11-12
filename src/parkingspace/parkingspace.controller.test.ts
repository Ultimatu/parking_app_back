import { Test, TestingModule } from '@nestjs/testing';
import { ParkingspaceController } from './parkingspace.controller';
import { ParkingspaceService } from './parkingspace.service';
import { CreateParkingSpaceDto } from './dto/create-parkingspace.dto';
import { ParkingSpace } from './entities/parkingspace.entity';
import { Response } from 'express';

describe('ParkingspaceController', () => {
  let controller: ParkingspaceController;
  let service: ParkingspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingspaceController],
      providers: [ParkingspaceService],
    }).compile();

    controller = module.get<ParkingspaceController>(ParkingspaceController);
    service = module.get<ParkingspaceService>(ParkingspaceService);
  });

  describe('createParkingSpace', () => {
    it('should create a new parking space', async () => {
      const createParkingSpaceDto: CreateParkingSpaceDto = {
        parkingNumber: 'A1',
        floor: 1,
        isAvailable: true,
        address: '123 Main St',
        openTime: '08:00',
        closeTime: '18:00',
      };
      const parkingSpace = new ParkingSpace();
      parkingSpace.id = 1;
      parkingSpace.parkingNumber = createParkingSpaceDto.parkingNumber;
      parkingSpace.floor = createParkingSpaceDto.floor;
      parkingSpace.isAvailable = createParkingSpaceDto.isAvailable;
      parkingSpace.address = createParkingSpaceDto.address;
      parkingSpace.openTime = createParkingSpaceDto.openTime;
      parkingSpace.closeTime = createParkingSpaceDto.closeTime;
      jest.spyOn(service, 'create').mockResolvedValue(parkingSpace);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.createParkingSpace(createParkingSpaceDto, res);

      expect(service.create).toHaveBeenCalledWith(createParkingSpaceDto);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(parkingSpace);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const createParkingSpaceDto: CreateParkingSpaceDto = {
        parkingNumber: 'A1',
        floor: 1,
        isAvailable: true,
        address: '123 Main St',
        openTime: '08:00',
        closeTime: '18:00',
      };
      const error = new Error('Invalid input');
      jest.spyOn(service, 'create').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.createParkingSpace(createParkingSpaceDto, res);

      expect(service.create).toHaveBeenCalledWith(createParkingSpaceDto);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getAllParkingSpaces', () => {
    it('should return all parking spaces', async () => {
      const parkingSpaces = [
        new ParkingSpace(),
        new ParkingSpace(),
        new ParkingSpace(),
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(parkingSpaces);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAllParkingSpaces(res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(parkingSpaces);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const error = new Error('Invalid input');
      jest.spyOn(service, 'findAll').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAllParkingSpaces(res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getParkingSpaceById', () => {
    it('should return a parking space by ID', async () => {
      const id = 1;
      const parkingSpace = new ParkingSpace();
      parkingSpace.id = id;
      jest.spyOn(service, 'findOne').mockResolvedValue(parkingSpace);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getParkingSpaceById(id, res);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(parkingSpace);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const id = 1;
      const error = new Error('Invalid input');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getParkingSpaceById(id, res);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('updateParkingSpaceById', () => {
    it('should update a parking space by ID', async () => {
      const id = 1;
      const updateParkingSpaceDto: CreateParkingSpaceDto = {
        parkingNumber: 'A1',
        floor: 1,
        isAvailable: true,
        address: '123 Main St',
        openTime: '08:00',
        closeTime: '18:00',
      };
      const parkingSpace = new ParkingSpace();
      parkingSpace.id = id;
      parkingSpace.parkingNumber = updateParkingSpaceDto.parkingNumber;
      parkingSpace.floor = updateParkingSpaceDto.floor;
      parkingSpace.isAvailable = updateParkingSpaceDto.isAvailable;
      parkingSpace.address = updateParkingSpaceDto.address;
      parkingSpace.openTime = updateParkingSpaceDto.openTime;
      parkingSpace.closeTime = updateParkingSpaceDto.closeTime;
      jest.spyOn(service, 'update').mockResolvedValue(parkingSpace);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.updateParkingSpaceById(id, updateParkingSpaceDto, res);

      expect(service.update).toHaveBeenCalledWith(id, updateParkingSpaceDto);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(parkingSpace);
    });

    it('should return a 404 error if the parking space is not found', async () => {
      const id = 1;
      const updateParkingSpaceDto: CreateParkingSpaceDto = {
        parkingNumber: 'A1',
        floor: 1,
        isAvailable: true,
        address: '123 Main St',
        openTime: '08:00',
        closeTime: '18:00',
      };
      jest.spyOn(service, 'update').mockResolvedValue(undefined);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.updateParkingSpaceById(id, updateParkingSpaceDto, res);

      expect(service.update).toHaveBeenCalledWith(id, updateParkingSpaceDto);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Parking space not found',
      });
    });

    it('should return a 400 error if the service throws an error', async () => {
      const id = 1;
      const updateParkingSpaceDto: CreateParkingSpaceDto = {
        parkingNumber: 'A1',
        floor: 1,
        isAvailable: true,
        address: '123 Main St',
        openTime: '08:00',
        closeTime: '18:00',
      };
      const error = new Error('Invalid input');
      jest.spyOn(service, 'update').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.updateParkingSpaceById(id, updateParkingSpaceDto, res);

      expect(service.update).toHaveBeenCalledWith(id, updateParkingSpaceDto);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('deleteParkingSpaceById', () => {
    it('should delete a parking space by ID', async () => {
      const id = 1;
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.deleteParkingSpaceById(id, res);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith();
    });

    it('should return a 404 error if the parking space is not found', async () => {
      const id = 1;
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.deleteParkingSpaceById(id, res);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Parking space not found',
      });
    });

    it('should return a 400 error if the service throws an error', async () => {
      const id = 1;
      const error = new Error('Invalid input');
      jest.spyOn(service, 'remove').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.deleteParkingSpaceById(id, res);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getAvailableParkingSpaces', () => {
    it('should return all available parking spaces', async () => {
      const parkingSpaces = [
        new ParkingSpace(),
        new ParkingSpace(),
        new ParkingSpace(),
      ];
      jest.spyOn(service, 'findAvailable').mockResolvedValue(parkingSpaces);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAvailableParkingSpaces(res);

      expect(service.findAvailable).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(parkingSpaces);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const error = new Error('Invalid input');
      jest.spyOn(service, 'findAvailable').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAvailableParkingSpaces(res);

      expect(service.findAvailable).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getUnavailableParkingSpaces', () => {
    it('should return all unavailable parking spaces', async () => {
      const parkingSpaces = [
        new ParkingSpace(),
        new ParkingSpace(),
        new ParkingSpace(),
      ];
      jest.spyOn(service, 'findUnavailable').mockResolvedValue(parkingSpaces);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getUnavailableParkingSpaces(res);

      expect(service.findUnavailable).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(parkingSpaces);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const error = new Error('Invalid input');
      jest.spyOn(service, 'findUnavailable').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getUnavailableParkingSpaces(res);

      expect(service.findUnavailable).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});
