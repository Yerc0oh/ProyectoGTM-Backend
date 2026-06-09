import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { PrismaService } from '../prisma/prisma.service';

import PDFDocument from 'pdfkit';
import { Response } from 'express';

import { MailService } from '../mail/mail.service';

import { Cron } from '@nestjs/schedule';
import { turnoComprobanteTemplate } from '../mail/mail.templates';

@Injectable()
export class TurnosService {

  constructor(private prisma: PrismaService, private mailService: MailService) { }

  async create(dto: CreateTurnoDto) {

    const doctor =
      await this.prisma.doctor.findUnique({
        where: {
          id: dto.doctorId,
        },
      });

    if (!doctor) {
      throw new NotFoundException(
        'Doctor no encontrado',
      );
    }

    const paciente =
      await this.prisma.paciente.findUnique({
        where: {
          id: dto.pacienteId,
        },
      });

    if (!paciente) {
      throw new NotFoundException(
        'Paciente no encontrado',
      );
    }

    const fechaTurno = new Date(dto.fechaHora);

    // No permitir turnos en el pasado
    if (fechaTurno < new Date()) {
      throw new BadRequestException(
        'No se pueden registrar turnos en el pasado',
      );
    }

    const diasSemana = [
      'DOMINGO',
      'LUNES',
      'MARTES',
      'MIERCOLES',
      'JUEVES',
      'VIERNES',
      'SABADO',
    ];

    const diaTurno =
      diasSemana[fechaTurno.getDay()];

    const horaTurno =
      fechaTurno.toTimeString().slice(0, 5);

    // Buscar disponibilidad del doctor
    const disponibilidad =
      await this.prisma.disponibilidad.findFirst({
        where: {
          doctorId: dto.doctorId,
          diaSemana: diaTurno,
          estado: true,
        },
      });

    if (!disponibilidad) {
      throw new BadRequestException(
        `El doctor no tiene disponibilidad para ${diaTurno}`,
      );
    }

    // Verificar que la hora esté dentro del rango permitido
    if (
      horaTurno < disponibilidad.horaInicio ||
      horaTurno > disponibilidad.horaFin
    ) {
      throw new BadRequestException(
        'La hora está fuera de la disponibilidad del doctor',
      );
    }

    // Verificar que no exista otro turno activo
    const turnoExistente =
      await this.prisma.turno.findFirst({
        where: {
          doctorId: dto.doctorId,
          fechaHora: fechaTurno,
          estado: {
            not: 'CANCELADO',
          },
        },
      });

    if (turnoExistente) {
      throw new BadRequestException(
        'Ya existe un turno para ese doctor en esa fecha y hora',
      );
    }

    return this.prisma.turno.create({
      data: {
        doctorId: dto.doctorId,
        pacienteId: dto.pacienteId,
        fechaHora: fechaTurno,
        motivoConsulta: dto.motivoConsulta,
      },
      include: {
        doctor: {
          include: {
            especialidad: true,
          },
        },
        paciente: true,
      },
    });
  }
  async findAll() {
    return this.prisma.turno.findMany({
      include: {
        paciente: true,
        doctor: {
          include: {
            especialidad: true,
          },
        }
      },
      orderBy: {
        fechaHora: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.turno.findUnique({
      where: { id },

      include: {
        paciente: true,
        doctor: {
          include: {
            especialidad: true,
          },
        }
      },
    });
  }

  async update(
    id: number,
    dto: UpdateTurnoDto,
  ) {
    return this.prisma.turno.update({
      where: { id },

      data: {
        ...dto,

        fechaHora: dto.fechaHora
          ? new Date(dto.fechaHora)
          : undefined,
      },
      include: {
        doctor: {
          include: {
            especialidad: true,
          },
        },
        paciente: true,
      },
    });
  }
  async remove(id: number) {
    return this.prisma.turno.update({
      where: { id },

      data: {
        estado: 'CANCELADO',
      },
    });
  }

  async confirmar(id: number) {
    return this.prisma.turno.update({
      where: { id },

      data: {
        estado: 'CONFIRMADO',
      },
      include: {
        doctor: {
          include: {
            especialidad: true,
          },
        },
        paciente: true,
      },
    });
  }
  async completar(id: number) {
    return this.prisma.turno.update({
      where: { id },

      data: {
        estado: 'COMPLETADO',
      },
      include: {
        doctor: {
          include: {
            especialidad: true,
          },
        },
        paciente: true,
      },
    });
  }
  async cancelar(id: number) {
    return this.prisma.turno.update({
      where: { id },

      data: {
        estado: 'CANCELADO',
      },
      include: {
        doctor: {
          include: {
            especialidad: true,
          },
        },
        paciente: true,
      },
    });
  }
  async generatePdf(id: number, res: Response) {
    const turno = await this.prisma.turno.findUnique({
      where: { id },
      include: {
        doctor: { include: { especialidad: true } },
        paciente: true,
      },
    });

    if (!turno) {
      throw new NotFoundException("Turno no encontrado");
    }

    const doc = new PDFDocument({ margin: 0, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=turno-${id}.pdf`);
    doc.pipe(res);

    const PAGE_W = 595;
    const PAGE_H = 842;
    const MARGIN = 50;
    const COL_W = PAGE_W - MARGIN * 2;

    // ── Paleta ──────────────────────────────────────
    const PRIMARY = "#1a6fc9";
    const PRIMARY_DARK = "#155a9c";
    const LIGHT_BG = "#f0f6ff";
    const MUTED = "#6c757d";
    const BORDER = "#d0dce8";
    const TEXT = "#1a2533";

    // ═══════════════════════════════════════════════
    // HEADER — banda azul completa
    // ═══════════════════════════════════════════════
    doc.rect(0, 0, PAGE_W, 110).fill(PRIMARY);

    // Rectángulo decorativo lateral oscuro
    doc.rect(0, 0, 8, 110).fill(PRIMARY_DARK);

    // Título
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#ffffff")
      .text("COMPROBANTE DE TURNO MÉDICO", MARGIN, 28, {
        width: COL_W,
        align: "center",
      });

    // Subtítulo
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("rgba(255,255,255,0.75)")
      .text("Clínica Médica — Sistema de Gestión de Turnos", MARGIN, 56, {
        width: COL_W,
        align: "center",
      });

    // Fecha de emisión
    doc
      .fontSize(9)
      .fillColor("rgba(255,255,255,0.6)")
      .text(
        `Emitido el ${new Date().toLocaleString("es-BO")}`,
        MARGIN,
        76,
        { width: COL_W, align: "center" }
      );

    // ═══════════════════════════════════════════════
    // BADGE de ID de turno — esquina superior derecha
    // ═══════════════════════════════════════════════
    const badgeX = PAGE_W - MARGIN - 90;
    doc.rect(badgeX, 16, 90, 28).fill(PRIMARY);
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor("#ffffff")
      .text("N° TURNO", badgeX, 22, { width: 90, align: "center" });
    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(`#${turno.id}`, badgeX, 31, { width: 90, align: "center" });

    // ═══════════════════════════════════════════════
    // HELPER — dibuja una sección con tabla de filas
    // ═══════════════════════════════════════════════
    const ROW_H = 26;

    const drawSection = (
      title: string,
      emoji: string,
      rows: { label: string; value: string }[],
      startY: number
    ): number => {
      // Encabezado de sección
      doc.rect(MARGIN, startY, COL_W, 28).fill(LIGHT_BG);
      doc.rect(MARGIN, startY, 4, 28).fill(PRIMARY);

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(PRIMARY)
        .text(`${emoji}  ${title}`, MARGIN + 14, startY + 8, {
          width: COL_W - 20,
        });

      let y = startY + 28;

      rows.forEach((row, i) => {
        // Fondo alternado
        if (i % 2 === 0) {
          doc.rect(MARGIN, y, COL_W, ROW_H).fill("#fafcff");
        } else {
          doc.rect(MARGIN, y, COL_W, ROW_H).fill("#ffffff");
        }

        // Borde inferior de la fila
        doc
          .moveTo(MARGIN, y + ROW_H)
          .lineTo(MARGIN + COL_W, y + ROW_H)
          .strokeColor(BORDER)
          .lineWidth(0.5)
          .stroke();

        // Columna izquierda — label
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(MUTED)
          .text(row.label.toUpperCase(), MARGIN + 12, y + 8, { width: 130 });

        // Línea divisoria vertical
        doc
          .moveTo(MARGIN + 150, y)
          .lineTo(MARGIN + 150, y + ROW_H)
          .strokeColor(BORDER)
          .lineWidth(0.5)
          .stroke();

        // Columna derecha — valor
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(TEXT)
          .text(row.value, MARGIN + 162, y + 7, {
            width: COL_W - 170,
          });

        y += ROW_H;
      });

      // Borde exterior de la tabla
      doc
        .rect(MARGIN, startY + 28, COL_W, ROW_H * rows.length)
        .strokeColor(BORDER)
        .lineWidth(0.8)
        .stroke();

      return y + 20; // retorna el Y final + espacio
    };

    // ═══════════════════════════════════════════════
    // SECCIONES DE DATOS
    // ═══════════════════════════════════════════════
    const fecha = new Date(turno.fechaHora);
    let currentY = 130;

    // Paciente
    currentY = drawSection(
      "DATOS DEL PACIENTE",
      "",
      [
        { label: "Nombre completo", value: `${turno.paciente.nombre} ${turno.paciente.apellido}` },
        { label: "ID Paciente", value: String(turno.paciente.id) },
      ],
      currentY
    );

    // Doctor
    currentY = drawSection(
      "DATOS DEL DOCTOR",
      "",
      [
        { label: "Nombre completo", value: `Dr. ${turno.doctor.nombre} ${turno.doctor.apellido}` },
        { label: "Especialidad", value: turno.doctor.especialidad.nombre },
      ],
      currentY
    );

    // Turno
    const turnoRows: { label: string; value: string }[] = [
      { label: "Fecha", value: fecha.toLocaleDateString("es-BO", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
      { label: "Hora", value: fecha.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }) },
      { label: "Estado", value: turno.estado },
    ];

    if (turno.motivoConsulta) {
      turnoRows.push({ label: "Motivo", value: turno.motivoConsulta });
    }

    currentY = drawSection("INFORMACIÓN DEL TURNO", "", turnoRows, currentY);

    // ═══════════════════════════════════════════════
    // SELLO / ESTADO — bloque visual centrado
    // ═══════════════════════════════════════════════
    const selloY = currentY + 10;
    const selloW = 180;
    const selloX = (PAGE_W - selloW) / 2;

    doc.rect(selloX, selloY, selloW, 44).fill(LIGHT_BG);
    doc.rect(selloX, selloY, selloW, 44).strokeColor(PRIMARY).lineWidth(1).stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(MUTED)
      .text("ESTADO DEL TURNO", selloX, selloY + 8, { width: selloW, align: "center" });

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(PRIMARY)
      .text(turno.estado, selloX, selloY + 22, { width: selloW, align: "center" });

    // ═══════════════════════════════════════════════
    // FOOTER — pegado al fondo de la página
    // ═══════════════════════════════════════════════
    doc
      .moveTo(MARGIN, PAGE_H - 55)
      .lineTo(PAGE_W - MARGIN, PAGE_H - 55)
      .strokeColor(BORDER)
      .lineWidth(0.8)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(MUTED)
      .text(
        "Este comprobante es un documento oficial generado por el Sistema de Gestión de Turnos Médicos.",
        MARGIN,
        PAGE_H - 46,
        { width: COL_W, align: "center" }
      );

    doc
      .fontSize(8)
      .fillColor(BORDER)
      .text(
        `turno-${turno.id} · ${new Date().toISOString()}`,
        MARGIN,
        PAGE_H - 28,
        { width: COL_W, align: "center" }
      );

    doc.end();
  }

  private async enviarCorreoRecordatorio(turno: any) {
    if (!turno.paciente.email) return;

    const fecha = new Date(turno.fechaHora);

    await this.mailService.sendMail({
      to: turno.paciente.email,
      subject: '📅 Recordatorio de turno médico',
      html: turnoComprobanteTemplate({
        paciente: `${turno.paciente.nombre} ${turno.paciente.apellido}`,
        doctor: `Dr. ${turno.doctor.nombre} ${turno.doctor.apellido}`,
        especialidad: turno.doctor.especialidad?.nombre,
        fecha: fecha.toISOString().split('T')[0], // YYYY-MM-DD estable
        hora: fecha.toLocaleTimeString('es-BO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }),
    });
  }

  async enviarRecordatorio(turnoId: number) {
    const turno = await this.prisma.turno.findUnique({
      where: { id: turnoId },
      include: {
        paciente: true,
        doctor: {
          include: { especialidad: true },
        },
      },
    });

    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    await this.enviarCorreoRecordatorio(turno);

    return this.prisma.turno.update({
      where: { id: turnoId },
      data: {
        recordatorioEnviado: true,
        fechaRecordatorio: new Date(),
      },
    });
  }

  async enviarRecordatoriosMasivos() {
    console.log("Enviando recordatorios masivos");

    const turnos = await this.prisma.turno.findMany({
      where: {
        recordatorioEnviado: false,
        
        estado: {
          in: ['PENDIENTE', 'CONFIRMADO'],
        },
      },
      include: {
        paciente: true,
        doctor: {
          include: { especialidad: true },
        },
      },
      orderBy: {
        fechaHora: 'asc',
      },
    });
    console.log("Turnos para recordatorios:", turnos.length);
    console.log("TODOS los turnos:", await this.prisma.turno.findMany());

    setImmediate(async () => {
      try {
        await this.procesarRecordatorios(turnos);
      } catch (e) {
        console.error("Error en proceso async:", e);
      }
    });

    return {
      message: "Proceso de recordatorios iniciado",
      total: turnos.length,
    };
  }

  private async procesarRecordatorios(turnos: any[]) {
    let enviados = 0;

    console.log("Enviando recordatorios");


    for (const turno of turnos) {
      console.log("Turno", turno.id);
      try {
        if (!turno.paciente.email) continue;
        
        console.log("Enviando correo a", turno.paciente.email);

        await this.enviarCorreoRecordatorio(turno);

        await this.prisma.turno.update({
          where: { id: turno.id },
          data: {
            recordatorioEnviado: true,
            fechaRecordatorio: new Date(),
          },
        });

        enviados++;

        console.log("Recordatorio enviado");
      } catch (err) {
        console.error(`Error en turno ${turno.id}`, err);
        continue;
      }
    }

    console.log("Recordatorios enviados:", enviados);
  }

  @Cron('0 * * * *') // cada hora
  async handleRecordatoriosAutomaticos() {
    await this.enviarRecordatoriosMasivos();
  }

  async findHoy() {
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date();
    fin.setHours(23, 59, 59, 999);

    return this.prisma.turno.findMany({
      where: {
        fechaHora: {
          gte: inicio,
          lte: fin,
        },
      },
      include: {
        doctor: true,
        paciente: true,
      },
      orderBy: {
        fechaHora: 'asc',
      },
    });
  }
}
