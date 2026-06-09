import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctore.dto';
import { UpdateDoctoreDto } from './dto/update-doctore.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DoctoresService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async create(
    createDoctorDto: CreateDoctorDto,
  ) {

    return this.prisma.doctor.create({
      data: createDoctorDto,
    });

  }
  async findAll() {

    return this.prisma.doctor.findMany({

      where: {
        estado: true,
      },

      include: {
        especialidad: true,
      },

    });

  }
  async findOne(id: number) {

    return this.prisma.doctor.findUnique({

      where: {
        id,
      },

      include: {
        especialidad: true,
      },

    });

  }

  async update(
    id: number,
    updateDoctorDto: UpdateDoctoreDto,
  ) {

    return this.prisma.doctor.update({

      where: {
        id,
      },

      data: updateDoctorDto,

    });

  }

  async remove(id: number) {

    return this.prisma.doctor.update({

      where: {
        id,
      },

      data: {
        estado: false,
      },

    });

  }
}
