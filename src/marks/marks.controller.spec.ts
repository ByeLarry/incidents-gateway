import { Test, TestingModule } from '@nestjs/testing';
import { MarkController } from './marks.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { MARKS_SERVICE_TAG } from '../utils/marks.service.provide';
import { of } from 'rxjs';
import { VerifiedRecvDto } from './dto/verified-recv.dto';
import { MarksGateway } from './marks.gateway';
import { MsgMarksEnum } from '../utils/msg.marks.enum';
import { MarkRecvDto } from './dto/mark-recv.dto';
import { CategoryDto } from './dto/category.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { MarkDto } from './dto/mark.dto';
import { FeatureTransformer } from '../utils/transformToFeature';
import { VerifyMarkDto } from './dto/verify-mark.dto';
import { BadRequestException } from '@nestjs/common';
import { CoordsDto } from './dto/coords.dto';

describe('MarksController', () => {
  let controller: MarkController;
  let mockClientProxy: any;
  let marksGateway: any;

  beforeEach(async () => {
    mockClientProxy = {
      send: jest.fn().mockImplementation(() => of('mock response')),
    };

    marksGateway = {
      emitMessageToAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [MarkController],
      providers: [
        {
          provide: MARKS_SERVICE_TAG,
          useValue: mockClientProxy,
        },
        {
          provide: MarksGateway,
          useValue: marksGateway,
        },
      ],
    }).compile();

    controller = module.get<MarkController>(MarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('[getMark] should return one mark', async () => {
    const mockRequestBody: MarkDto = {
      userId: '1',
      markId: '1',
      lat: 10,
      lng: 20,
    };
    const mockResponse: MarkRecvDto = {
      id: 1,
      lat: 10,
      lng: 20,
      title: 'test',
      description: 'test description',
      categoryId: 2,
      distance: 100,
      color: 'blue',
    };

    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getMark(mockRequestBody);

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: MsgMarksEnum.MARK_GET },
      mockRequestBody,
    );
    expect(result).toEqual(mockResponse);
  });

  it('[getMark] should throw an error if the mark is not found', async () => {
    const mockRequestBody: MarkDto = {
      userId: '1',
      markId: '9999',
      lat: 10,
      lng: 20,
    };

    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of('404'));

    await expect(controller.getMark(mockRequestBody)).rejects.toThrow(
      'Not found',
    );
  });

  it('[getMark] should throw BadRequestException if markId is missing', async () => {
    const mockRequestBody = {
      userId: '1',
      lat: 10,
      lng: 20,
    };

    await expect(
      controller.getMark(mockRequestBody as MarkDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[getMarks] should return an empty array if no marks are found', async () => {
    const mockRequestBody: CoordsDto = { lat: 1, lng: 1 };
    const mockResponse: MarkRecvDto[] = [];

    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getMarks(mockRequestBody);

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: MsgMarksEnum.MAP_INIT },
      mockRequestBody,
    );
    expect(result).toEqual([]);
  });

  it('[getMarks] should throw an error if the client proxy fails', async () => {
    const mockRequestBody = { lat: 1, lng: 2 };

    jest.spyOn(mockClientProxy, 'send').mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    await expect(controller.getMarks(mockRequestBody)).rejects.toThrow(
      'Internal Server Error',
    );
  });

  it('[getMarks] should return an array of nearest marks', async () => {
    const mockRequestBody = { lat: 1, lng: 2 };
    const mockResponse: MarkRecvDto[] = [
      {
        id: 10,
        lat: 20,
        lng: 30,
        title: 'test',
        description: 'test',
        categoryId: 40,
        distance: 50,
        color: 'red',
      },
    ];

    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getMarks(mockRequestBody);

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: MsgMarksEnum.MAP_INIT },
      mockRequestBody,
    );

    const transformedResponse =
      FeatureTransformer.transformToFeatureDto(mockResponse);

    expect(result).toEqual(transformedResponse);
  });

  it('[getMarks] should return an empty array if no marks are available', async () => {
    const mockRequestBody = { lat: 1, lng: 2 };
    const mockResponse: MarkRecvDto[] = [];

    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getMarks(mockRequestBody);

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: MsgMarksEnum.MAP_INIT },
      mockRequestBody,
    );
    expect(result).toEqual([]);
  });

  it('[getMarks] should throw BadRequestException if lat is missing', async () => {
    const mockRequestBody = { lng: 0 };

    await expect(
      controller.getMarks(mockRequestBody as CoordsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[getMarks] should throw BadRequestException if lng is missing', async () => {
    const mockRequestBody = { lat: 0 };

    await expect(
      controller.getMarks(mockRequestBody as CoordsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[verifyTrue] should return VerifiedRecvDto', async () => {
    const mockResponse: VerifiedRecvDto = { verified: 1 };
    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of(mockResponse));

    const mockRequestBody = {
      markId: 1,
      userId: '1',
      csrf_token: 'token',
    };

    const result = await controller.verifyTrue(mockRequestBody);

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: MsgMarksEnum.MARK_VERIFY_TRUE },
      mockRequestBody,
    );
    expect(result).toEqual(mockResponse);
  });

  it('[verifyTrue] should throw an error if markId is missing', async () => {
    const mockRequestBody = {
      userId: '1',
      csrf_token: 'token',
    };

    await expect(
      controller.verifyTrue(mockRequestBody as VerifyMarkDto),
    ).rejects.toThrow();
  });

  it('[verifyTrue] should throw BadRequestException if markId is missing', async () => {
    const mockRequestBody = {
      userId: '1',
      csrf_token: 'token',
    };

    await expect(
      controller.verifyTrue(mockRequestBody as VerifyMarkDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[verifyTrue] should throw BadRequestException if userId is missing', async () => {
    const mockRequestBody = {
      markId: 1,
      csrf_token: 'token',
    };

    await expect(
      controller.verifyTrue(mockRequestBody as VerifyMarkDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[verifyFalse] should return VerifiedRecvDto', async () => {
    const mockResponse: VerifiedRecvDto = { verified: 0 };
    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of(mockResponse));

    const mockRequestBody = {
      markId: 1,
      userId: '1',
      csrf_token: 'token',
    };

    const result = await controller.verifyFalse(mockRequestBody);

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: MsgMarksEnum.MARK_VERIFY_FALSE },
      mockRequestBody,
    );
    expect(result).toEqual(mockResponse);
  });

  it('[verifyFalse] should throw an error if markId is missing', async () => {
    const mockRequestBody = {
      userId: '1',
      csrf_token: 'token',
    };

    await expect(
      controller.verifyFalse(mockRequestBody as VerifyMarkDto),
    ).rejects.toThrow();
  });

  it('[verifyFalse] should throw BadRequestException if markId is missing', async () => {
    const mockRequestBody = {
      userId: '1',
      csrf_token: 'token',
    };

    await expect(
      controller.verifyFalse(mockRequestBody as VerifyMarkDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[verifyFalse] should throw BadRequestException if userId is missing', async () => {
    const mockRequestBody = {
      markId: 1,
      csrf_token: 'token',
    };

    await expect(
      controller.verifyFalse(mockRequestBody as VerifyMarkDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[getCategories] should return an array of categories', async () => {
    const mockResponse: CategoryDto[] = [
      {
        id: 1,
        name: 'Test Category',
        color: 'blue',
      },
    ];

    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getCategories();

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: MsgMarksEnum.CATEGORIES },
      {},
    );
    expect(result).toEqual(mockResponse);
  });

  it('[getCategories] should return an empty array if no categories are found', async () => {
    const mockResponse: CategoryDto[] = [];

    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getCategories();

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: MsgMarksEnum.CATEGORIES },
      {},
    );
    expect(result).toEqual([]);
  });

  it('[createMark] should create a new mark and emit it via WebSocket', async () => {
    const mockRequestBody: CreateMarkDto = {
      lat: 10,
      lng: 20,
      title: 'New Mark',
      description: 'Description of the new mark',
      categoryId: 2,
      csrf_token: 'token',
      userId: '1',
    };

    const mockResponse: MarkRecvDto = {
      id: 1,
      lat: 10,
      lng: 20,
      title: 'New Mark',
      description: 'Description of the new mark',
      categoryId: 2,
      distance: 0,
      color: 'green',
    };

    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.createMark(mockRequestBody);

    const transformedResponse =
      FeatureTransformer.transformToFeatureDto(mockResponse);

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: MsgMarksEnum.CREATE_MARK },
      mockRequestBody,
    );
    expect(marksGateway.emitMessageToAll).toHaveBeenCalledWith(
      'new-mark',
      transformedResponse,
    );
    expect(result).toEqual(transformedResponse);
  });

  it('[createMark] should throw an error if required fields are missing', async () => {
    const mockRequestBody = {
      lat: 10,
      lng: 20,
      title: 'New Mark',
      csrf_token: 'token',
      userId: '1',
    };

    await expect(
      controller.createMark(mockRequestBody as CreateMarkDto),
    ).rejects.toThrow();
  });

  it('[createMark] should create a new mark and emit it via WebSocket', async () => {
    const mockRequestBody: CreateMarkDto = {
      lat: 10,
      lng: 20,
      title: 'New Mark',
      description: 'Description of the new mark',
      categoryId: 2,
      csrf_token: 'token',
      userId: '1',
    };

    const mockResponse: MarkRecvDto = {
      id: 1,
      lat: 10,
      lng: 20,
      title: 'New Mark',
      description: 'Description of the new mark',
      categoryId: 2,
      distance: 0,
      color: 'green',
    };

    jest.spyOn(mockClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.createMark(mockRequestBody);

    const transformedResponse =
      FeatureTransformer.transformToFeatureDto(mockResponse);

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: MsgMarksEnum.CREATE_MARK },
      mockRequestBody,
    );
    expect(marksGateway.emitMessageToAll).toHaveBeenCalledWith(
      'new-mark',
      transformedResponse,
    );
    expect(result).toEqual(transformedResponse);
  });

  it('[createMark] should throw BadRequestException if title is missing', async () => {
    const mockRequestBody = {
      lat: 10,
      lng: 20,
      description: 'Description of the new mark',
      categoryId: 2,
      csrf_token: 'token',
      userId: '1',
    };

    await expect(
      controller.createMark(mockRequestBody as CreateMarkDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[createMark] should throw BadRequestException if lat is missing', async () => {
    const mockRequestBody = {
      title: 'New Mark',
      description: 'Description of the new mark',
      categoryId: 2,
      csrf_token: 'token',
      userId: '1',
    };

    await expect(
      controller.createMark(mockRequestBody as CreateMarkDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[createMark] should throw BadRequestException if lng is missing', async () => {
    const mockRequestBody = {
      lat: 10,
      title: 'New Mark',
      description: 'Description of the new mark',
      categoryId: 2,
      csrf_token: 'token',
      userId: '1',
    };

    await expect(
      controller.createMark(mockRequestBody as CreateMarkDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[createMark] should throw BadRequestException if csrf_token is missing', async () => {
    const mockRequestBody = {
      lat: 10,
      lng: 20,
      title: 'New Mark',
      description: 'Description of the new mark',
      categoryId: 2,
      userId: '1',
    };

    await expect(
      controller.createMark(mockRequestBody as CreateMarkDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('[createMark] should throw BadRequestException if userId is missing', async () => {
    const mockRequestBody = {
      lat: 10,
      lng: 20,
      title: 'New Mark',
      description: 'Description of the new mark',
      categoryId: 2,
      csrf_token: 'token',
    };

    await expect(
      controller.createMark(mockRequestBody as CreateMarkDto),
    ).rejects.toThrow(BadRequestException);
  });
});
