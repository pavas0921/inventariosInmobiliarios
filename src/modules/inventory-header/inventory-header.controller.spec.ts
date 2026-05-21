import { Test, TestingModule } from '@nestjs/testing';
import { InventoryHeaderController } from './inventory-header.controller';

describe('InventoryHeaderController', () => {
  let controller: InventoryHeaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryHeaderController],
    }).compile();

    controller = module.get<InventoryHeaderController>(InventoryHeaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
