import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignement.entity';
import { Car } from 'src/cars/entities/car.entity';
import { ParkingSpace } from 'src/parkingspace/entities/parkingspace.entity';
import { User } from 'src/user/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateAssignmentDto } from './dto/create-assignement.dto';
import { UpdateAssignementDto } from './dto/update-assignement.dto';

@Injectable()
export class AssignementService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignementRepository: Repository<Assignment>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ParkingSpace)
    private readonly parkingSpaceRepository: Repository<ParkingSpace>,
  ) {}

  async create(createAssignementDto: CreateAssignmentDto): Promise<Assignment> {
    // Check space availability
    const parkingSpace = await this.parkingSpaceRepository.findOne({
      where: { id: createAssignementDto.parkingSpaceId },
    });

    Logger.log(parkingSpace);
    if (!parkingSpace || !parkingSpace.isAvailable) {
      throw new NotFoundException('ParkingSpace not available');
    }

    const [user] = await Promise.all([
      this.userRepository.findOne({
        where: { id: createAssignementDto.userId },
      } as FindOneOptions<User>),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create a new assignement
    const newAssignment = new Assignment();
    newAssignment.user = user;
    newAssignment.parkingSpace = parkingSpace;
    newAssignment.assDate = new Date(Date.now());
    newAssignment.floorNumber = parkingSpace.floor;

    // Update parkingSpace information
    parkingSpace.floor--;
    if (parkingSpace.floor === 0) {
      parkingSpace.isAvailable = false;
    }

    // Save changes to the database
    await Promise.all([
      this.parkingSpaceRepository.save(parkingSpace),
      this.assignementRepository.save(newAssignment),
    ]);

    return newAssignment;
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignementRepository.find({
      relations: ['user', 'parkingSpace'],
    });
  }

  async findOne(id: number): Promise<Assignment | undefined> {
    return this.assignementRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    updateAssignmentDto: UpdateAssignementDto,
  ): Promise<Assignment | undefined> {
    const existingAssignment = await this.assignementRepository.findOne({
      where: { id },
    });

    if (!existingAssignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Update the assignment with the new data
    const [user, parkingSpace] = await Promise.all([
      this.userRepository.findOneBy({
        id: updateAssignmentDto.userId,
      }),
      this.parkingSpaceRepository.findOneBy({
        id: updateAssignmentDto.parkingSpaceId,
      }),
    ]);

    Logger.log('user: ' + user);
    if (!user || !parkingSpace) {
      throw new NotFoundException('User, or ParkingSpace not found');
    }
    existingAssignment.user = user;
    existingAssignment.parkingSpace = parkingSpace;
    existingAssignment.assDate = new Date(Date.now());

    return this.assignementRepository.save(existingAssignment);
  }

  async remove(id: number): Promise<Assignment | undefined> {
    const assignment = await this.assignementRepository.findOneBy({
      id,
    });

    Logger.log('assignment: ' + assignment);
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const parkingSpace = await this.parkingSpaceRepository.findOneBy({
      id: assignment.parkingSpace.id,
    });

    Logger.log('parkingSpace: ' + parkingSpace);
    if (!parkingSpace) {
      throw new NotFoundException('ParkingSpace not found');
    }

    parkingSpace.floor++;
    if (parkingSpace.floor > 0) {
      parkingSpace.isAvailable = true;
    }

    await Promise.all([
      this.parkingSpaceRepository.save(parkingSpace),
      this.assignementRepository.remove(assignment),
    ]);

    return assignment;
  }

  async findUserAssignment(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.parkingSpace'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.assignments;
  }
}
