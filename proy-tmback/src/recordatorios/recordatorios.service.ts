import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecordatoriosService {
  constructor(private prisma: PrismaService) { }

  // cada 5 minutos
  @Cron('*/5 * * * *')
  async enviarRecordatorios() {
    const ahora = new Date();

    const limiteInferior = ahora;
    const limiteSuperior = new Date(Date.now() + 24 * 60 * 60 * 1000);

    console.log("AHORA:", ahora);
    console.log("LIMITE INFERIOR:", limiteInferior);
    console.log("LIMITE SUPERIOR:", limiteSuperior);


    const turnos = await this.prisma.turno.findMany({
      where: {
        estado: 'CONFIRMADO',
        recordatorioEnviado: false,
        fechaHora: {
          gte: limiteInferior,
          lte: limiteSuperior,
        },
      },
      include: {
        paciente: true,
        doctor: true,
      },
    });

    console.log("Fechas turnos:")
    turnos.forEach((t) => console.log(t.fechaHora));

    for (const turno of turnos) {
      try {
        // aquí tu lógica de envío email
        console.log(
          `📧 Enviando recordatorio a ${turno.paciente.email}`
        );

        // TODO: email service real

        await this.prisma.turno.update({
          where: { id: turno.id },
          data: {
            recordatorioEnviado: true,
            fechaRecordatorio: new Date(),
          },
        });

      } catch (err) {
        console.error(
          `Error enviando recordatorio turno ${turno.id}`,
          err,
        );
      }
    }
  }
}