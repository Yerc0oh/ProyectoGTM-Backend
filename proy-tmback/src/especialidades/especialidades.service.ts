import { Injectable } from '@nestjs/common';
import { CreateEspecialidadeDto } from './dto/create-especialidade.dto';
import { UpdateEspecialidadeDto } from './dto/update-especialidade.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EspecialidadesService {

  constructor(private prisma: PrismaService) { }

  async create(createEspecialidadeDto: CreateEspecialidadeDto) {
    return this.prisma.especialidad.create({
      data: {
        nombre: createEspecialidadeDto.nombre,
        descripcion: createEspecialidadeDto.descripcion,
      },
    });
  }

  async findAll() {
    return this.prisma.especialidad.findMany({
      where: {
        estado: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findAllDisabled() {
    return this.prisma.especialidad.findMany({
      where: {
        estado: false,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.especialidad.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateEspecialidadeDto: UpdateEspecialidadeDto) {
    return this.prisma.especialidad.update({
      where: {
        id,
      },
      data: updateEspecialidadeDto,
    });
  }

  async remove(id: number) {
    return this.prisma.especialidad.update({
      where: {
        id,
      },
      data: {
        estado: false,
      },
    });
  }
}
