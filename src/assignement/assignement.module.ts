import { Logger, Module } from '@nestjs/common';
import { AssignementService } from './assignement.service';
import { AssignementController } from './assignement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignement.entity';
import { Car } from 'src/cars/entities/car.entity';
import { User } from 'src/user/entities/user.entity';
import { ParkingSpace } from 'src/parkingspace/entities/parkingspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Car, User, ParkingSpace])],
  controllers: [AssignementController],
  providers: [AssignementService, Logger],
})
export class AssignementModule {}
