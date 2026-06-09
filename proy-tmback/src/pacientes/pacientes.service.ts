import { Injectable } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) { }

  async create(
    createPacienteDto: CreatePacienteDto,
  ) {
    return this.prisma.paciente.create({
      data: {
        ...createPacienteDto,
        fecha_nacimiento: new Date(
          createPacienteDto.fecha_nacimiento,
        ),
      },
    });
  }

  async findAll() {
    return this.prisma.paciente.findMany({
      where: {
        estado: true,
      },
      orderBy: {
        apellido: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.paciente.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updatePacienteDto: UpdatePacienteDto,
  ) {
    return this.prisma.paciente.update({
      where: {
        id,
      },
      data: {
        nombre: updatePacienteDto.nombre,
        apellido: updatePacienteDto.apellido,
        email: updatePacienteDto.email,
        telefono: updatePacienteDto.telefono,
        direccion: updatePacienteDto.direccion,
        fecha_nacimiento: updatePacienteDto.fecha_nacimiento ? new Date(updatePacienteDto.fecha_nacimiento) : undefined,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.paciente.update({
      where: {
        id,
      },
      data: {
        estado: false,
      },
    });
  }
}
