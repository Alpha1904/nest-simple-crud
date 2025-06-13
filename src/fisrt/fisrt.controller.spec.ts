import { Test, TestingModule } from '@nestjs/testing';
import { FisrtController } from './fisrt.controller';

describe('FisrtController', () => {
  let controller: FisrtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FisrtController],
    }).compile();

    controller = module.get<FisrtController>(FisrtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
