import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logs/logs.module';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { DoctoresModule } from './doctores/doctores.module';
import { DisponibilidadesModule } from './disponibilidades/disponibilidades.module';
import { TurnosModule } from './turnos/turnos.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RecordatoriosService } from './recordatorios/recordatorios.service';
import { RecordatoriosModule } from './recordatorios/recordatorios.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, LogsModule, EspecialidadesModule, PacientesModule, DoctoresModule, DisponibilidadesModule, TurnosModule, EstadisticasModule, MailModule, ScheduleModule.forRoot(), RecordatoriosModule],
  controllers: [AppController],
  providers: [AppService, RecordatoriosService],
})
export class AppModule {}
