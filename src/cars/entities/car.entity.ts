import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('_cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, type: 'varchar', length: 255 })
  imma: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  brand: string;

  @Column()
  color: string;

  @ManyToOne(() => User, user => user.cars, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  owner: User;
}
