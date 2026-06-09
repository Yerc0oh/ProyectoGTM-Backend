import { Test, TestingModule } from '@nestjs/testing';
import { DisponibilidadesController } from './disponibilidades.controller';
import { DisponibilidadesService } from './disponibilidades.service';

describe('DisponibilidadesController', () => {
  let controller: DisponibilidadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisponibilidadesController],
      providers: [DisponibilidadesService],
    }).compile();

    controller = module.get<DisponibilidadesController>(DisponibilidadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
