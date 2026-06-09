import { Test, TestingModule } from '@nestjs/testing';
import { DoctoresController } from './doctores.controller';
import { DoctoresService } from './doctores.service';

describe('DoctoresController', () => {
  let controller: DoctoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctoresController],
      providers: [DoctoresService],
    }).compile();

    controller = module.get<DoctoresController>(DoctoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
