import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Res,
  Put,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { AssignementService } from './assignement.service';
import { CreateAssignmentDto } from './dto/create-assignement.dto';
import { UpdateAssignementDto } from './dto/update-assignement.dto';
import { Assignment } from './entities/assignement.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Assignments')
@Controller('assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AssignementController {
  constructor(private readonly assignementService: AssignementService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiBody({ type: CreateAssignmentDto })
  @ApiResponse({
    status: 201,
    description: 'The assignment has been successfully created.',
  })
  async createAssignment(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @Res() res,
  ): Promise<Assignment> {
    try {
      const assignment =
        await this.assignementService.create(createAssignmentDto);
      return res.status(201).json(assignment);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiResponse({ status: 200, description: 'Return all assignments.' })
  async getAllAssignments(@Res() res): Promise<Assignment[]> {
    try {
      const assignments = await this.assignementService.findAll();
      return res.status(200).json(assignments);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an assignment by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async getAssignmentById(
    @Param('id') id: number,
    @Res() res,
  ): Promise<Assignment | undefined> {
    try {
      const assignment = await this.assignementService.findOne(id);
      return res.status(200).json(assignment);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  /**
   * Update an assignment by ID with a partial DTO
   * @param id : number - ID of the assignment
   * @param updateAssignmentDto : UpdateAssignementDto - Partial DTO of the assignment
   * @param res : Response - Response object from express
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update an assignment by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateAssignementDto })
  async updateAssignmentById(
    @Param('id') id: number,
    @Body() updateAssignmentDto: UpdateAssignementDto,
    @Res() res,
  ): Promise<Assignment | undefined> {
    try {
      const assignment = await this.assignementService.update(
        id,
        updateAssignmentDto,
      );
      return res.status(200).json(assignment);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  /**
   * Delete an assignment by ID
   * @param id : number - ID of the assignment
   * @param res : Response - Response object from express
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an assignment by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async deleteAssignmentById(
    @Param('id') id: number,
    @Res() res,
  ): Promise<void> {
    try {
      await this.assignementService.remove(id);
      return res.status(204).json();
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  /**
   * Get assignments for a specific User
   * @param id : number - Id of the User
   * @param res : Response - Response object from express
   */
  @Get('my-parkings/:id')
  @ApiOperation({ summary: 'Get assignments for a specific car' })
  @ApiParam({ name: 'id', type: 'number' })
  async getAssignmentsUser(
    @Param('id') id: number,
    @Res() res,
  ): Promise<Assignment[]> {
    try {
      Logger.log('getAssignmentsUser');
      const assignments = await this.assignementService.findUserAssignment(id);
      Logger.log('assignments: ' + assignments);
      Logger.log('assignments: ' + JSON.stringify(assignments.assignments));
      return assignments.assignments;
    } catch (err) {
      Logger.log('error: ' + err);
      return res.status(400).json({ message: err.message });
    }
  }
}
