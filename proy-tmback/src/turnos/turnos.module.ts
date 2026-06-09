import { Module } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [TurnosController],
  providers: [TurnosService, MailService],
})
export class TurnosModule {}
