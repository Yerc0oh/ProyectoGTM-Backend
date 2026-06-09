import { Controller, Get } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service'

@Controller('estadisticas')
export class EstadisticasController {
    constructor(private readonly estadisticasService: EstadisticasService) {}

    @Get()
    getStats() {
        return this.estadisticasService.getStats();
    }
}