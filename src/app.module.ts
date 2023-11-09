import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { SwaggerModule } from '@nestjs/swagger';
import { ParkingspaceModule } from './parkingspace/parkingspace.module';
import { AssignementModule } from './assignement/assignement.module';
import { ParkingSpace } from './parkingspace/entities/parkingspace.entity';
import { Assignment } from './assignement/entities/assignement.entity';
import { CarsModule } from './cars/cars.module';
import { Car } from './cars/entities/car.entity';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, ParkingSpace, Assignment, Car],
      synchronize: true,
      ssl: {
        ca: fs.readFileSync(process.env.SSL_CA_CERTIFICATES),
      },
    }),
    UserModule,
    AuthModule,
    PassportModule,
    SwaggerModule,
    ParkingspaceModule,
    AssignementModule,
    CarsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
