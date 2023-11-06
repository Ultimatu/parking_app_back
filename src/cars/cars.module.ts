import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { User } from 'src/user/entities/user.entity';
import { ParkingSpace } from 'src/parkingspace/entities/parkingspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, User, ParkingSpace])],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
