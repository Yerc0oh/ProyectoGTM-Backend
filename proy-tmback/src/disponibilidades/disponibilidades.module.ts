import { Module } from '@nestjs/common';
import { DisponibilidadesService } from './disponibilidades.service';
import { DisponibilidadesController } from './disponibilidades.controller';

@Module({
  controllers: [DisponibilidadesController],
  providers: [DisponibilidadesService],
})
export class DisponibilidadesModule {}
