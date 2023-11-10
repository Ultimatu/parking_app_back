import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingSpace } from './entities/parkingspace.entity';
import { Repository } from 'typeorm';
import { CreateParkingSpaceDto } from './dto/create-parkingspace.dto';

@Injectable()
export class ParkingspaceService {
  constructor(
    @InjectRepository(ParkingSpace)
    private readonly parkingspaceRepository: Repository<ParkingSpace>,
  ) {}

  /**
   * Create a new parkingspace.
   * @param createParkingSpaceDto - The data to create a new parkingspace.
   * @returns The created parkingspace entity.
   */
  async create(
    createParkingSpaceDto: CreateParkingSpaceDto,
  ): Promise<ParkingSpace> {
    //verify is the name exist
    const parkingspace = await this.parkingspaceRepository.findOne({
      where: { parkingNumber: createParkingSpaceDto.parkingNumber },
    });
    if (parkingspace) {
      throw new HttpException('Cet Parking existe déjà', 409);
    }

    const newParkingSpace = new ParkingSpace();
    newParkingSpace.parkingNumber = createParkingSpaceDto.parkingNumber;
    newParkingSpace.isAvailable = createParkingSpaceDto.isAvailable;
    newParkingSpace.floor = createParkingSpaceDto.floor;
    newParkingSpace.openTime = createParkingSpaceDto.openTime;
    newParkingSpace.closeTime = createParkingSpaceDto.closeTime;
    newParkingSpace.address = createParkingSpaceDto.address;
    return this.parkingspaceRepository.save(newParkingSpace);
  }

  /**
   * Get all parkingspaces.
   * @returns A list of all parkingspaces.
   */
  async findAll(): Promise<ParkingSpace[]> {
    return this.parkingspaceRepository.find();
  }

  /**
   * Get a parkingspace by its ID.
   * @param id - The ID of the parkingspace to retrieve.
   * @returns The parkingspace entity if found, otherwise undefined.
   */
  async findOne(id: number): Promise<ParkingSpace | undefined> {
    return this.parkingspaceRepository.findOne({
      where: { id },
    });
  }

  /**
   * Update a parkingspace by its ID.
   * @param id - The ID of the parkingspace to update.
   * @param updateParkingSpaceDto - The data to update the parkingspace.
   * @returns The updated parkingspace entity if found, otherwise undefined.
   */
  async update(
    id: number,
    updateParkingSpaceDto: CreateParkingSpaceDto,
  ): Promise<ParkingSpace | undefined> {
    const parkingspace = await this.parkingspaceRepository.findOne({
      where: { id },
    });
    if (!parkingspace) {
      throw new HttpException("Cet Parking n'existe pas", 409);
    }
    const parkingspac1 = await this.parkingspaceRepository.findOne({
      where: { parkingNumber: updateParkingSpaceDto.parkingNumber },
    });

    if (parkingspac1.id !== id) {
      throw new HttpException("Il y'a une autre parking avec le même nom", 409);
    }

    parkingspace.parkingNumber = updateParkingSpaceDto.parkingNumber;
    parkingspace.isAvailable = updateParkingSpaceDto.isAvailable;
    parkingspace.floor = updateParkingSpaceDto.floor;
    parkingspace.openTime = updateParkingSpaceDto.openTime;
    parkingspace.closeTime = updateParkingSpaceDto.closeTime;
    parkingspace.address = updateParkingSpaceDto.address;
    return this.parkingspaceRepository.save(parkingspace);
  }

  /**
   * Delete a parkingspace by its ID.
   * @param id - The ID of the parkingspace to delete.
   * @returns The deleted parkingspace entity if found, otherwise undefined.
   */
  async remove(id: number): Promise<ParkingSpace | undefined> {
    const parkingspace = await this.parkingspaceRepository.findOne({
      where: { id },
    });
    if (!parkingspace) {
      throw new NotFoundException('Parkingspace not found');
    }
    return this.parkingspaceRepository.remove(parkingspace);
  }

  /**
   * Get all parkingspaces.
   * @returns A list of all parkingspaces.
   */
  async findAvailable(): Promise<ParkingSpace[]> {
    return this.parkingspaceRepository.find({
      where: { isAvailable: true },
    });
  }

  /**
   * Get all parkingspace that are not available.
   * @returns A list of all parkingspaces that are not available.
   */
  async findUnavailable(): Promise<ParkingSpace[]> {
    return this.parkingspaceRepository.find({
      where: { isAvailable: false },
    });
  }
}
