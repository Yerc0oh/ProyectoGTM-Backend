import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class EstadisticasService {
  constructor(private prisma: PrismaService) {}

  async getStats() {

    const [
      totalTurnos,
      totalPacientes,
      totalDoctores,
      totalEspecialidades,
      estados,
      especialidades,
    ] = await Promise.all([

      this.prisma.turno.count(),

      this.prisma.paciente.count({
        where: { estado: true },
      }),

      this.prisma.doctor.count({
        where: { estado: true },
      }),

      this.prisma.especialidad.count({
        where: { estado: true },
      }),

      this.prisma.turno.groupBy({
        by: ["estado"],
        _count: true,
      }),

      this.prisma.turno.groupBy({
        by: ["doctorId"],
        _count: true,
      }),
    ]);

    const doctores =
      await this.prisma.doctor.findMany({
        include: {
          especialidad: true,
        },
      });

    const especialidadesMap = new Map<
      string,
      number
    >();

    especialidades.forEach((item) => {
      const doctor = doctores.find(
        (d) => d.id === item.doctorId,
      );

      if (!doctor) return;

      const nombreEsp =
        doctor.especialidad.nombre;

      especialidadesMap.set(
        nombreEsp,
        (especialidadesMap.get(nombreEsp) || 0) +
          item._count,
      );
    });

    return {
      cards: {
        totalTurnos,
        totalPacientes,
        totalDoctores,
        totalEspecialidades,
      },

      estados,

      especialidades:
        Array.from(
          especialidadesMap.entries(),
        ).map(([label, value]) => ({
          label,
          value,
        })),
    };
  }
}