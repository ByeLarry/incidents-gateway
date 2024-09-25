import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'socket.io';
import { MarksGateway } from '../marks/marks.gateway';

describe('MarksGateway', () => {
  let gateway: MarksGateway;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarksGateway],
    }).compile();

    gateway = module.get<MarksGateway>(MarksGateway);
    server = {
      emit: jest.fn(),
    } as unknown as Server;

    gateway.server = server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('sendMessageToAll', () => {
    it('should emit message to all', () => {
      const message = 'Test message';
      gateway.sendMessageToAll(message);
      expect(server.emit).toHaveBeenCalledWith('message', message);
    });
  });

  describe('emitMessageToAll', () => {
    it('should emit custom tag and message to all', () => {
      const tag = 'customTag';
      const message = { data: 'Test data' };
      gateway.emitMessageToAll(tag, message);
      expect(server.emit).toHaveBeenCalledWith(tag, message);
    });
  });
});
