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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // Replace 'mysql' with the appropriate database type
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
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
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    ParkingspaceModule,
    AssignementModule,
    CarsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
