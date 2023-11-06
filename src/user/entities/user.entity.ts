import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum';
import { Assignment } from 'src/assignement/entities/assignement.entity';
import { Car } from 'src/cars/entities/car.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, type: 'varchar', length: 255 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  password: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  firstName: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  lastName: string;

  @Column()
  role: Role;

  @OneToMany(() => Car, (car) => car.owner)
  cars: Car[];

  @OneToMany(() => Assignment, (assignment) => assignment.user)
  assignments: Assignment[];
}
