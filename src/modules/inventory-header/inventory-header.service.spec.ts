import { Test, TestingModule } from '@nestjs/testing';
import { InventoryHeaderService } from './inventory-header.service';

describe('InventoryHeaderService', () => {
  let service: InventoryHeaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryHeaderService],
    }).compile();

    service = module.get<InventoryHeaderService>(InventoryHeaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
