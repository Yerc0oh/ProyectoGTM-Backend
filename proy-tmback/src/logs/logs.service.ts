import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsService {

  constructor(private prisma: PrismaService) {}

  async createLog(data: {
    usuarioId: number;
    ip: string;
    browser: string;
    evento: 'INGRESO' | 'SALIDA';
  }) {
    return this.prisma.logAcceso.create({
      data: {
        usuarioId: data.usuarioId,
        ip: data.ip,
        browser: data.browser,
        evento: data.evento,
      },
    });
  }
}