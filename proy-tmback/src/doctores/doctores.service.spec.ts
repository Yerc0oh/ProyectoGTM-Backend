import { Test, TestingModule } from '@nestjs/testing';
import { DoctoresService } from './doctores.service';

describe('DoctoresService', () => {
  let service: DoctoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctoresService],
    }).compile();

    service = module.get<DoctoresService>(DoctoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
