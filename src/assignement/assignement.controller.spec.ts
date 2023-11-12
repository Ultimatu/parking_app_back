import { Test, TestingModule } from '@nestjs/testing';
import { AssignementController } from './assignement.controller';
import { AssignementService } from './assignement.service';
import { CreateAssignmentDto } from './dto/create-assignement.dto';
import { UpdateAssignementDto } from './dto/update-assignement.dto';
import { Assignment } from './entities/assignement.entity';
import { User } from '../user/entities/user.entity';
import { ParkingSpace } from '../parkingspace/entities/parkingspace.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AssignementController', () => {
  let controller: AssignementController;
  let service: AssignementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignementService,
        {
          provide: getRepositoryToken(Assignment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ParkingSpace),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<AssignementController>(AssignementController);
    service = module.get<AssignementService>(AssignementService);
  });

  describe('createAssignment', () => {
    it('should create a new assignment', async () => {
      const createAssignmentDto: CreateAssignmentDto = {
        floorNumber: 1,
        parkingSpaceId: 1,
        userId: 1,
        assDate: '2023-05-31T14:00:00.000Z',
      };
      const assignment: Assignment = {
        id: 1,
        assDate: new Date(),
        floorNumber: 1,
        user: new User(),
        parkingSpace: new ParkingSpace(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(assignment);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.createAssignment(createAssignmentDto, res);

      expect(service.create).toHaveBeenCalledWith(createAssignmentDto);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(assignment);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const createAssignmentDto: CreateAssignmentDto = {
        floorNumber: 1,
        parkingSpaceId: 1,
        userId: 1,
        assDate: '2021-05-31T14:00:00.000Z',
      };
      const error = new Error('Invalid input');
      jest.spyOn(service, 'create').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.createAssignment(createAssignmentDto, res);

      expect(service.create).toHaveBeenCalledWith(createAssignmentDto);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getAllAssignments', () => {
    it('should return all assignments', async () => {
      const assignments: Assignment[] = [
        {
          id: 1,
          assDate: new Date(),
          floorNumber: 1,
          user: new User(),
          parkingSpace: new ParkingSpace(),
        },
        {
          id: 2,
          assDate: new Date(),
          floorNumber: 2,
          user: new User(),
          parkingSpace: new ParkingSpace(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(assignments);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAllAssignments(res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(assignments);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const error = new Error('Invalid input');
      jest.spyOn(service, 'findAll').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAllAssignments(res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getAssignmentById', () => {
    it('should return an assignment by ID', async () => {
      const id = 1;
      const assignment: Assignment = {
        id: 1,
        assDate: new Date(),
        floorNumber: 1,
        user: new User(),
        parkingSpace: new ParkingSpace(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(assignment);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAssignmentById(id, res);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(assignment);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const id = 1;
      const error = new Error('Invalid input');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAssignmentById(id, res);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('updateAssignmentById', () => {
    it('should update an assignment by ID', async () => {
      const id = 1;
      const updateAssignmentDto: UpdateAssignementDto = {
        floorNumber: 2,
        parkingSpaceId: 2,
        userId: 2,
      };
      const assignment: Assignment = {
        id: 1,
        assDate: new Date(),
        floorNumber: 2,
        user: new User(),
        parkingSpace: new ParkingSpace(),
      };
      jest.spyOn(service, 'update').mockResolvedValue(assignment);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.updateAssignmentById(id, updateAssignmentDto, res);

      expect(service.update).toHaveBeenCalledWith(id, updateAssignmentDto);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(assignment);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const id = 1;
      const updateAssignmentDto: UpdateAssignementDto = {
        floorNumber: 2,
        parkingSpaceId: 2,
        userId: 2,
      };
      const error = new Error('Invalid input');
      jest.spyOn(service, 'update').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.updateAssignmentById(id, updateAssignmentDto, res);

      expect(service.update).toHaveBeenCalledWith(id, updateAssignmentDto);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('deleteAssignmentById', () => {
    it('should delete an assignment by ID', async () => {
      const id = 1;
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.deleteAssignmentById(id, res);

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

      await controller.deleteAssignmentById(id, res);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getAssignmentsUser', () => {
    it('should return assignments associated with a user', async () => {
      const id = 1;
      const assignments: Assignment[] = [
        {
          id: 1,
          assDate: new Date(),
          floorNumber: 1,
          user: new User(),
          parkingSpace: new ParkingSpace(),
        },
        {
          id: 2,
          assDate: new Date(),
          floorNumber: 2,
          user: new User(),
          parkingSpace: new ParkingSpace(),
        },
      ];
      jest.spyOn(service, 'findUserAssignment').mockResolvedValue(assignments);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAssignmentsUser(id, res);

      expect(service.findUserAssignment).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(assignments);
    });

    it('should return a 400 error if the service throws an error', async () => {
      const id = 1;
      const error = new Error('Invalid input');
      jest.spyOn(service, 'findUserAssignment').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.getAssignmentsUser(id, res);

      expect(service.findUserAssignment).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});
