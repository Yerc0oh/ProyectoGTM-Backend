import { PartialType } from '@nestjs/mapped-types';
import { CreateDisponibilidadDto } from './create-disponibilidade.dto';

export class UpdateDisponibilidadDto extends PartialType(CreateDisponibilidadDto) {}
