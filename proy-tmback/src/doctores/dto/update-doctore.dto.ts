import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from './create-doctore.dto';

export class UpdateDoctoreDto extends PartialType(CreateDoctorDto) {}
