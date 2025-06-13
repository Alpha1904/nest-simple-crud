import { Test, TestingModule } from '@nestjs/testing';
import { FisrtService } from './fisrt.service';

describe('FisrtService', () => {
  let service: FisrtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FisrtService],
    }).compile();

    service = module.get<FisrtService>(FisrtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
