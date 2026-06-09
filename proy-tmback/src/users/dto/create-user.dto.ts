import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { Rol } from '@prisma/client';

export class CreateUserDto {

  @IsNotEmpty()
  nombre!: string;

  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(Rol)
  rol!: Rol;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}