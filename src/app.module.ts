import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { SwaggerModule } from '@nestjs/swagger';
import { JwtModule } from '@nestjs/jwt';
import { ParkingspaceModule } from './parkingspace/parkingspace.module';
import { AssignementModule } from './assignement/assignement.module';
import { ParkingSpace } from './parkingspace/entities/parkingspace.entity';
import { Assignment } from './assignement/entities/assignement.entity';
import { CarsModule } from './cars/cars.module';
import { Car } from './cars/entities/car.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: '_parking_service',
      entities: [User, ParkingSpace, Assignment, Car],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PassportModule,
    SwaggerModule,
    JwtModule.register({
      secret: 'secrete',
      signOptions: { expiresIn: '1d' },
    }),
    ParkingspaceModule,
    AssignementModule,
    CarsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
