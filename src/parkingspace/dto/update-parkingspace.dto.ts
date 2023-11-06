import { PartialType } from '@nestjs/swagger';
import { CreateParkingSpaceDto } from './create-parkingspace.dto';

export class UpdateParkingspaceDto extends PartialType(CreateParkingSpaceDto) {}
