import { PartialType } from '@nestjs/swagger';
import { CreateAssignmentDto } from './create-assignement.dto';

export class UpdateAssignementDto extends PartialType(CreateAssignmentDto) {}
