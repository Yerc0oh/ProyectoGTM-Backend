import { Module } from '@nestjs/common';
import { DoctoresService } from './doctores.service';
import { DoctoresController } from './doctores.controller';

@Module({
  controllers: [DoctoresController],
  providers: [DoctoresService],
})
export class DoctoresModule {}
