import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserData(@Param('id') id: number, @Res() res: Response) {
    try {
      const user = await this.userService.findOne(id);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = this.userService.update(id, updateUserDto);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @Res() res: Response) {
    try {
      this.userService.remove(id);
      return res.status(204).json({ message: 'User deleted' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.userService.findAll();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
}
