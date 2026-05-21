import { Test, TestingModule } from '@nestjs/testing';
import { AmbientController } from './ambient.controller';

describe('AmbientController', () => {
  let controller: AmbientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmbientController],
    }).compile();

    controller = module.get<AmbientController>(AmbientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
