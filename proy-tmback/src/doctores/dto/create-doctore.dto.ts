import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateDoctorDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsInt()
  especialidadId: number;
}