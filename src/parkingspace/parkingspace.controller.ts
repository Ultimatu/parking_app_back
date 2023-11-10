import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParkingspaceService } from './parkingspace.service';
import { CreateParkingSpaceDto } from './dto/create-parkingspace.dto';
import { ParkingSpace } from './entities/parkingspace.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Parkingspaces')
@Controller('admin/parkingspaces')
export class ParkingspaceController {
  constructor(private readonly parkingspaceService: ParkingspaceService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @ApiOperation({ summary: 'Create a new parking space' })
  @ApiBody({ type: CreateParkingSpaceDto })
  async createParkingSpace(
    @Body() createParkingSpaceDto: CreateParkingSpaceDto,
    @Res() res,
  ): Promise<ParkingSpace> {
    try {
      const parkingSpace = await this.parkingspaceService.create(
        createParkingSpaceDto,
      );
      return res.status(201).json(parkingSpace);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all parking spaces' })
  @ApiResponse({ status: 200, description: 'Return all parking spaces.' })
  async getAllParkingSpaces(@Res() res): Promise<ParkingSpace[]> {
    try {
      const parkingSpaces = await this.parkingspaceService.findAll();
      return res.status(200).json(parkingSpaces);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a parking space by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async getParkingSpaceById(
    @Param('id') id: number,
    @Res() res,
  ): Promise<ParkingSpace | undefined> {
    try {
      const parkingSpace = await this.parkingspaceService.findOne(id);
      return res.status(200).json(parkingSpace);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  ////@Roles(Role.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a parking space by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: CreateParkingSpaceDto })
  async updateParkingSpaceById(
    @Param('id') id: number,
    @Body() updateParkingSpaceDto: CreateParkingSpaceDto,
    @Res() res,
  ): Promise<ParkingSpace | undefined> {
    try {
      const parkingSpace = await this.parkingspaceService.update(
        id,
        updateParkingSpaceDto,
      );
      if (parkingSpace) {
        return res.status(200).json(parkingSpace);
      } else {
        return res.status(404).json({ message: 'Parking space not found' });
      }
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  //@Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a parking space by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async deleteParkingSpaceById(
    @Param('id') id: number,
    @Res() res,
  ): Promise<void> {
    try {
      const deletedParkingSpace = await this.parkingspaceService.remove(id);
      if (deletedParkingSpace) {
        return res.status(204).json();
      } else {
        return res.status(404).json({ message: 'Parking space not found' });
      }
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Get('available')
  @ApiOperation({ summary: 'Get all available parking spaces' })
  async getAvailableParkingSpaces(@Res() res): Promise<ParkingSpace[]> {
    try {
      const parkingSpaces = await this.parkingspaceService.findAvailable();
      return res.status(200).json(parkingSpaces);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Get('unavailable')
  @ApiOperation({ summary: 'Get all unavailable parking spaces' })
  async getUnavailableParkingSpaces(@Res() res): Promise<ParkingSpace[]> {
    try {
      const parkingSpaces = await this.parkingspaceService.findUnavailable();
      return res.status(200).json(parkingSpaces);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
}
