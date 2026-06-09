import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctoresService } from './doctores.service';
import { CreateDoctorDto } from './dto/create-doctore.dto';
import { UpdateDoctoreDto } from './dto/update-doctore.dto';

@Controller('doctores')
export class DoctoresController {
  constructor(private readonly doctoresService: DoctoresService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctoresService.create(createDoctorDto);
  }

  @Get()
  findAll() {
    return this.doctoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctoreDto) {
    return this.doctoresService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctoresService.remove(+id);
  }
}
