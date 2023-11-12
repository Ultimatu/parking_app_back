import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new car.
   * @param createCarDto - The data to create a new car.
   * @returns The created car entity.
   */
  async create(createCarDto: CreateCarDto): Promise<Car> {
    const user = this.userRepository.findOneBy({ id: createCarDto.ownerId });
    if (!user) {
      throw new Error('User not found');
    }
    const newCar = new Car();
    newCar.brand = createCarDto.brand;
    newCar.color = createCarDto.color;
    newCar.imma = createCarDto.imma;
    newCar.owner = await user;
    const car = this.carRepository.create(newCar);
    return this.carRepository.save(car);
  }

  /**
   * Get all cars.
   * @returns A list of all cars.
   */
  async findAll(): Promise<Car[]> {
    return this.carRepository.find();
  }

  /**
   * Get a car by its ID.
   * @param id - The ID of the car to retrieve.
   * @returns The car entity if found, otherwise undefined.
   */
  async findOne(id: number): Promise<Car | undefined> {
    return this.carRepository.findOne({
      where: { id },
    } as FindOneOptions<Car>);
  }

  /**
   * Update a car by its ID.
   * @param id - The ID of the car to update.
   * @param updateCarDto - The data to update the car.
   * @returns The updated car entity if found, otherwise undefined.
   */
  async update(
    id: number,
    updateCarDto: UpdateCarDto,
  ): Promise<Car | undefined> {
    const existingCar = await this.carRepository.findOne({
      where: { id },
    } as FindOneOptions<Car>);
    if (!existingCar) {
      throw new Error('Car not found');
    }

    // Update the car with the new data
    const user = await this.userRepository.findOneBy({
      id: updateCarDto.ownerId,
    });
    if (!user) {
      throw new Error('User not found');
    }

    existingCar.brand = updateCarDto.brand;
    existingCar.color = updateCarDto.color;
    existingCar.imma = updateCarDto.imma;
    existingCar.owner = user;
    return this.carRepository.save(existingCar);
  }

  /**
   * Delete a car by its ID.
   * @param id - The ID of the car to delete.
   */
  async remove(id: number): Promise<void> {
    const existingCar = await this.carRepository.findOne({
      where: { id },
    } as FindOneOptions<Car>);
    if (existingCar) {
      await this.carRepository.remove(existingCar);
    }
  }

  /**
   * Get cars associated with a user.
   * @param id - The ID of the user to retrieve cars for.
   * @returns A list of cars associated with the user.
   */
  async getUserCars(id: number): Promise<Car[]> {
    const ownerD = await this.userRepository.findOneBy({ id });
    if (!ownerD) {
      return []; // Return an empty array if the user is not found
    }

    return this.carRepository.find({
      where: { owner: ownerD },
    } as FindOneOptions<Car>);
  }
}
