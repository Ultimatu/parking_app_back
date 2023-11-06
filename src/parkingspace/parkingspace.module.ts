import { Module } from '@nestjs/common';
import { ParkingspaceService } from './parkingspace.service';
import { ParkingspaceController } from './parkingspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpace } from './entities/parkingspace.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpace, User])],
  controllers: [ParkingspaceController],
  providers: [ParkingspaceService],
})
export class ParkingspaceModule {}
