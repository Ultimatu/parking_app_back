import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './guards/jwt.strategy';
import { RoleGuard } from './guards/role.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { GuestGuard } from './guards/guest.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  providers: [AuthService, JwtStrategy, RoleGuard, GuestGuard, Logger],
  controllers: [AuthController],
})
export class AuthModule {}
