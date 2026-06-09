import { Injectable } from '@nestjs/common';
import { CreateDisponibilidadDto } from './dto/create-disponibilidade.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidade.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DisponibilidadesService {
  constructor(private prisma: PrismaService) { }

  async create(
    dto: CreateDisponibilidadDto,
  ) {

    return this.prisma.disponibilidad.create({
      data: dto,
      include: {
        doctor: true,
      },
    });

  }

  async findAll() {

    return this.prisma.disponibilidad.findMany({

      where: {
        estado: true,
      },

      include: {
        doctor: {
          include: {
            especialidad: true,
          },
        },
      },

    });

  }

  async findOne(id: number) {

    return this.prisma.disponibilidad.findUnique({

      where: {
        id,
      },

      include: {
        doctor: {
          include: {
            especialidad: true,
          },
        },
      },

    });

  }

  async update(
    id: number,
    dto: UpdateDisponibilidadDto,
  ) {

    return this.prisma.disponibilidad.update({

      where: {
        id,
      },

      data: dto,

    });

  }

  async remove(id: number) {

    return this.prisma.disponibilidad.update({

      where: {
        id,
      },

      data: {
        estado: false,
      },

    });

  }
}
