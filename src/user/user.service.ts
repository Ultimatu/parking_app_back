import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ id });

    if (!existingUser) {
      throw new Error(`User with ID ${id} not found.`);
    }

    if (updateUserDto.email) {
      existingUser.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      existingUser.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.firstName) {
      existingUser.firstName = updateUserDto.firstName;
    }

    if (updateUserDto.lastName) {
      existingUser.lastName = updateUserDto.lastName;
    }

    return this.userRepository.save(existingUser);
  }

  async remove(id: number): Promise<void> {
    const existingUser = await this.userRepository.findOneBy({ id });

    if (!existingUser) {
      throw new Error(`User with ID ${id} not found.`);
    }

    await this.userRepository.remove(existingUser);
  }
}
