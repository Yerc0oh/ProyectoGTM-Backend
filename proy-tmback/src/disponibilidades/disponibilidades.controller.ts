import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DisponibilidadesService } from './disponibilidades.service';
import { CreateDisponibilidadDto } from './dto/create-disponibilidade.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidade.dto';

@Controller('disponibilidades')
export class DisponibilidadesController {
  constructor(private readonly disponibilidadesService: DisponibilidadesService) {}

  @Post()
  create(@Body() createDisponibilidadDto: CreateDisponibilidadDto) {
    return this.disponibilidadesService.create(createDisponibilidadDto);
  }

  @Get()
  findAll() {
    return this.disponibilidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disponibilidadesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDisponibilidadDto: UpdateDisponibilidadDto) {
    return this.disponibilidadesService.update(+id, updateDisponibilidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disponibilidadesService.remove(+id);
  }
}
