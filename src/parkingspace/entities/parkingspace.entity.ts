import { Assignment } from 'src/assignement/entities/assignement.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('_parking_spaces')
export class ParkingSpace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  parkingNumber: string;

  @Column({ nullable: false, type: 'int' })
  floor: number;

  @Column()
  isAvailable: boolean;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  occupationTime: number;

  @OneToMany(() => Assignment, (assignement) => assignement.parkingSpace)
  assignments: Assignment[];
}
