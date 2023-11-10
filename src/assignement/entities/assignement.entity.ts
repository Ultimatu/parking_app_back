import { ParkingSpace } from 'src/parkingspace/entities/parkingspace.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity('_assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assDate: Date;

  @ManyToOne(() => User, user => user.assignments)
  user: User;

  @Column({ nullable: false, type: 'int' })
  floorNumber: number;

  @ManyToOne(() => ParkingSpace, parkingSpace => parkingSpace.assignments)
  parkingSpace: ParkingSpace;
}
