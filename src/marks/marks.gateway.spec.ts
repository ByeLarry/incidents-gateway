import { Test, TestingModule } from '@nestjs/testing';
import { MarksGateway } from './marks.gateway';

describe('MarksGateway', () => {
  let gateway: MarksGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarksGateway],
    }).compile();

    gateway = module.get<MarksGateway>(MarksGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
