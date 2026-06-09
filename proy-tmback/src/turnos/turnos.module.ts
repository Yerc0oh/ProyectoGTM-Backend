import { Module } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { MailService } from '../mail/resend.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [TurnosController],
  providers: [TurnosService, MailService],
})
export class TurnosModule {}
