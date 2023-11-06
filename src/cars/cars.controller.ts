import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/guards/role.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';

@ApiTags('Cars')
@Controller('cars')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Roles('customer')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @ApiOperation({ summary: 'Create a new car' })
  @ApiBody({ type: CreateCarDto })
  async createCar(
    @Body() createCarDto: CreateCarDto,
    @Res() res,
  ): Promise<Car> {
    try {
      const car = await this.carsService.create(createCarDto);
      return res.status(201).json(car);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all cars' })
  @ApiResponse({ status: 200, description: 'Return all cars.' })
  async getAllCars(@Res() res): Promise<Car[]> {
    try {
      const cars = await this.carsService.findAll();
      return res.status(200).json(cars);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async getCarById(
    @Param('id') id: number,
    @Res() res,
  ): Promise<Car | undefined> {
    try {
      const car = await this.carsService.findOne(id);
      return res.status(200).json(car);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a car by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateCarDto })
  async updateCarById(
    @Param('id') id: number,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<Car | undefined> {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a car by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async deleteCarById(@Param('id') id: number, @Res() res): Promise<void> {
    try {
      await this.carsService.remove(id);
      return res.status(204).json();
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get cars associated with a user' })
  @ApiParam({ name: 'id', type: 'number' })
  async getCarsByUserId(@Param('id') id: number, @Res() res): Promise<Car[]> {
    try {
      const cars = await this.carsService.getUserCars(id);
      return res.status(200).json(cars);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
}
