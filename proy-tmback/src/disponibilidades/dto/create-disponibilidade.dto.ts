import {
  IsInt,
  IsNotEmpty,
  IsString,
} from "class-validator";

export class CreateDisponibilidadDto {

  @IsInt()
  doctorId: number;

  @IsString()
  @IsNotEmpty()
  diaSemana: string;

  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @IsString()
  @IsNotEmpty()
  horaFin: string;
}