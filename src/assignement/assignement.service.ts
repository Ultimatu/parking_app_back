import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!parkingSpace || !parkingSpace.isAvailable) {
      throw new NotFoundException('ParkingSpace not available');
    }

    // Verify if user, car, and parkingSpace exist
    const [user, car] = await Promise.all([
      this.userRepository.findOne({
        where: { id: createAssignementDto.userId },
      } as FindOneOptions<User>),
      this.carRepository.findOne({
        where: { id: createAssignementDto.carId },
      } as FindOneOptions<Car>),
    ]);

    if (!user || !car) {
      throw new NotFoundException('User or Car not found');
    }

    // Check if the car is already assigned
    const existingAssignment = await this.assignementRepository.findOne({
      where: { car: car },
    } as FindOneOptions<Assignment>);

    if (existingAssignment) {
      throw new NotFoundException('This car is already assigned');
    }

    // Create a new assignement
    const newAssignment = new Assignment();
    newAssignment.user = user;
    newAssignment.car = car;
    newAssignment.parkingSpace = parkingSpace;
    newAssignment.assDate = createAssignementDto.assDate || new Date();
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
    return this.assignementRepository.find();
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
    const [user, car, parkingSpace] = await Promise.all([
      this.userRepository.findOneBy({
        id: updateAssignmentDto.userId,
      }),
      this.carRepository.findOne({
        where: { id: updateAssignmentDto.carId },
      } as FindOneOptions<Car>),

      this.parkingSpaceRepository.findOneBy({
        id: updateAssignmentDto.parkingSpaceId,
      }),
    ]);

    if (!user || !car || !parkingSpace) {
      throw new NotFoundException('User, Car, or ParkingSpace not found');
    }

    existingAssignment.user = user;
    existingAssignment.car = car;
    existingAssignment.parkingSpace = parkingSpace;
    existingAssignment.assDate = updateAssignmentDto.assDate;

    return this.assignementRepository.save(existingAssignment);
  }

  async remove(id: number): Promise<Assignment | undefined> {
    const assignment = await this.assignementRepository.findOneBy({
      id: id,
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const parkingSpace = await this.parkingSpaceRepository.findOneBy({
      id: assignment.parkingSpace.id,
    });

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

  /**
   * Get all assignments.
   * @returns A list of all assignments.
   * @param imma - The Immatirculation of the car to retrieve assignments for.
   * @param isAssigned - Whether the assignment is assigned or not.
   * @returns A list of assignments associated with the car.
   */
  async findAssignmentsForCar(
    imma: number,
    isAssigned?: boolean,
  ): Promise<Assignment[]> {
    const query: any = { car: { imma: imma } };

    if (isAssigned !== undefined) {
      query.isAssigned = isAssigned;
    }

    return this.assignementRepository.find({
      where: query,
    } as FindOneOptions<Assignment>);
  }
}
