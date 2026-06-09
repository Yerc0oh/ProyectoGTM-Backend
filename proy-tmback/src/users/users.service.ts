import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.usuario.findMany({
      where: {
        estado: true,
      },

      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        estado: true,

        logsAcceso: {
          select: {
            fechaHora: true,
            evento: true,
          },

          orderBy: {
            fechaHora: 'desc',
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },

      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        estado: true,

        logsAcceso: {
          select: {
            fechaHora: true,
            evento: true,
          },

          orderBy: {
            fechaHora: 'desc',
          },
        },
      },
    });
  }

  async create(dto: CreateUserDto) {

    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    return this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        password: hashedPassword,
        rol: dto.rol,
      },
    });
  }

  async logicRemove(id: number) {
    return this.prisma.usuario.update({
      where: { id },
      data: { estado: false },
    });
  }

  async findByEmail(email: string) {
    if (!email) {
      throw new Error('Email no recibido');
    }

    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async update(
    id: number,
    dto: UpdateUserDto,
  ) {

    await this.findOne(id);

    const data: any = {
      ...dto,
    };

    if (dto.password) {
      data.password =
        await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {

    await this.findOne(id);

    return this.prisma.usuario.update({
      where: { id },

      data: {
        estado: false,
      },
    });
  }
}