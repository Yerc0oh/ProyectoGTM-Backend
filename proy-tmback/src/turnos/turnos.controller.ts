import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res } from '@nestjs/common';
import express from 'express';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) { }

  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnosService.create(createTurnoDto);
  }

  @Get()
  findAll() {
    return this.turnosService.findAll();
  }
  @Get('hoy')
  findHoy() {
    return this.turnosService.findHoy();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnosService.update(+id, updateTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosService.remove(+id);
  }

  @Patch(':id/confirmar')
  confirmar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.turnosService.confirmar(id);
  }

  @Patch(':id/completar')
  completar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.turnosService.completar(id);
  }

  @Patch(':id/cancelar')
  cancelar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.turnosService.cancelar(id);
  }

  @Get(':id/pdf')
  generatePdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: express.Response,
  ) {
    return this.turnosService.generatePdf(Number(id), res);
  }

  @Patch(':id/recordatorio')
  enviarRecordatorio(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.enviarRecordatorio(id);
  }

  @Post('recordatorios/enviar')
  enviarMasivos() {
    return this.turnosService.enviarRecordatoriosMasivos();
  }
}
