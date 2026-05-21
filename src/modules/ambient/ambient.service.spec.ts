import { Test, TestingModule } from '@nestjs/testing';
import { AmbientService } from './ambient.service';

describe('AmbientService', () => {
  let service: AmbientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmbientService],
    }).compile();

    service = module.get<AmbientService>(AmbientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
