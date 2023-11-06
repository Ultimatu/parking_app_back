import { Car } from 'src/cars/entities/car.entity';
import { ParkingSpace } from 'src/parkingspace/entities/parkingspace.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  Column,
} from 'typeorm';

@Entity('_assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assDate: Date;

  @ManyToOne(() => User, (user) => user.assignments)
  user: User;

  @ManyToOne(() => ParkingSpace, (parkingSpace) => parkingSpace.assignments)
  parkingSpace: ParkingSpace;

  @OneToOne(() => Car)
  car: Car;
}
