import {
  IsInt,
  IsDateString,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateTurnoDto {
  @IsInt()
  doctorId: number;

  @IsInt()
  pacienteId: number;

  @IsDateString()
  fechaHora: string;

  @IsOptional()
  @IsString()
  motivoConsulta?: string;

}