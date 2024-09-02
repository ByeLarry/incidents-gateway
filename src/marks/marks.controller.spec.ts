import { Test, TestingModule } from '@nestjs/testing';
import { MarkController } from './marks.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { MARKS_SERVICE_TAG } from '../utils/marks.service.provide';
import { of } from 'rxjs';
import { VerifiedRecvDto } from './dto/verifiedRecv.dto';
import { MarksGateway } from './marks.gateway';
import { MsgMarksEnum } from '../utils/msg.marks.enum';
import { MarkRecvDto } from './dto/markRecv.dto';
import { CategoryDto } from './dto/category.dto';
import { CreateMarkDto } from './dto/createMark.dto';
import { MarkDto } from './dto/mark.dto';
import { FeatureTransformer } from '../utils/transformToFeature';
import { VerifyMarkDto } from './dto/verifyMark.dto';
import { BadRequestException } from '@nestjs/common';
import { CoordsDto } from './dto/coords.dto';
import { AUTH_SERVICE_TAG } from '../utils/auth.service.provide';
import { AuthGuard } from '../guards/auth.guard';
import { validate } from 'class-validator';

describe('MarksController', () => {
  let controller: MarkController;
  let mockMarkClientProxy: any;
  let mockAuthClientProxy: any;
  let marksGateway: any;
  let mockAuthGuard: any;

  beforeEach(async () => {
    mockMarkClientProxy = {
      send: jest.fn().mockImplementation(() => of('mock response')),
    };

    mockAuthClientProxy = {
      send: jest.fn().mockImplementation(() => of('mock response')),
    };

    marksGateway = {
      emitMessageToAll: jest.fn(),
    };

    mockAuthGuard = {
      canActivate: jest.fn().mockImplementation(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [MarkController],
      providers: [
        {
          provide: MARKS_SERVICE_TAG,
          useValue: mockMarkClientProxy,
        },
        {
          provide: MarksGateway,
          useValue: marksGateway,
        },
        {
          provide: AUTH_SERVICE_TAG,
          useValue: mockAuthClientProxy,
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: mockAuthGuard.canActivate,
          },
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
      markId: 1,
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

    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getMark(mockRequestBody);

    expect(mockMarkClientProxy.send).toHaveBeenCalledWith(
      MsgMarksEnum.MARK_GET,
      mockRequestBody,
    );
    expect(result).toEqual(mockResponse);
  });

  it('[getMark] should throw an error if the mark is not found', async () => {
    const mockRequestBody: MarkDto = {
      userId: '1',
      markId: 9999,
      lat: 10,
      lng: 20,
    };

    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of('404'));

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

    const errors = await validate(
      Object.assign(new MarkDto(), mockRequestBody),
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it('[getMark] should throw BadRequestException if userId is missing', async () => {
    const mockRequestBody = {
      markId: '1',
      lat: 10,
      lng: 20,
    };

    const errors = await validate(
      Object.assign(new MarkDto(), mockRequestBody),
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it('[getMarks] should return an empty array if no marks are found', async () => {
    const mockRequestBody: CoordsDto = { lat: 1, lng: 1 };
    const mockResponse: MarkRecvDto[] = [];

    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getMarks(mockRequestBody);

    expect(mockMarkClientProxy.send).toHaveBeenCalledWith(
      MsgMarksEnum.MAP_INIT,
      mockRequestBody,
    );
    expect(result).toEqual([]);
  });

  it('[getMarks] should throw an error if the client proxy fails', async () => {
    const mockRequestBody = { lat: 1, lng: 2 };

    jest.spyOn(mockMarkClientProxy, 'send').mockImplementation(() => {
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

    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getMarks(mockRequestBody);

    expect(mockMarkClientProxy.send).toHaveBeenCalledWith(
      MsgMarksEnum.MAP_INIT,
      mockRequestBody,
    );

    const transformedResponse =
      FeatureTransformer.transformToFeatureDto(mockResponse);

    expect(result).toEqual(transformedResponse);
  });

  it('[getMarks] should return an empty array if no marks are available', async () => {
    const mockRequestBody = { lat: 1, lng: 2 };
    const mockResponse: MarkRecvDto[] = [];

    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getMarks(mockRequestBody);

    expect(mockMarkClientProxy.send).toHaveBeenCalledWith(
      MsgMarksEnum.MAP_INIT,
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
    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of(mockResponse));

    const mockRequestBody = {
      markId: 1,
      userId: '1',
      csrf_token: 'token',
    };

    const result = await controller.verifyTrue(mockRequestBody);

    expect(mockMarkClientProxy.send).toHaveBeenCalledWith(
      MsgMarksEnum.MARK_VERIFY_TRUE,
      mockRequestBody,
    );
    expect(result).toEqual(mockResponse);
  });

  it('[verifyTrue] should throw BadRequestException if markId is missing', async () => {
    const mockRequestBody = {
      userId: '1',
      csrf_token: 'token',
    };

    const errors = await validate(
      Object.assign(new VerifyMarkDto(), mockRequestBody),
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it('[verifyTrue] should throw BadRequestException if userId is missing', async () => {
    const mockRequestBody = {
      markId: 1,
      csrf_token: 'token',
    };

    const errors = await validate(
      Object.assign(new VerifyMarkDto(), mockRequestBody),
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it('[verifyFalse] should return VerifiedRecvDto', async () => {
    const mockResponse: VerifiedRecvDto = { verified: 0 };
    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of(mockResponse));

    const mockRequestBody = {
      markId: 1,
      userId: '1',
      csrf_token: 'token',
    };

    const result = await controller.verifyFalse(mockRequestBody);

    expect(mockMarkClientProxy.send).toHaveBeenCalledWith(
      MsgMarksEnum.MARK_VERIFY_FALSE,
      mockRequestBody,
    );
    expect(result).toEqual(mockResponse);
  });

  it('[verifyFalse] should throw BadRequestException if markId is missing', async () => {
    const mockRequestBody = {
      userId: '1',
      csrf_token: 'token',
    };

    const errors = await validate(
      Object.assign(new VerifyMarkDto(), mockRequestBody),
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it('[verifyFalse] should throw BadRequestException if userId is missing', async () => {
    const mockRequestBody = {
      markId: 1,
      csrf_token: 'token',
    };

    const errors = await validate(
      Object.assign(new VerifyMarkDto(), mockRequestBody),
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it('[getCategories] should return an array of categories', async () => {
    const mockResponse: CategoryDto[] = [
      {
        id: 1,
        name: 'Test Category',
        color: 'blue',
      },
    ];

    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getCategories();

    expect(mockMarkClientProxy.send).toHaveBeenCalledWith(
      MsgMarksEnum.CATEGORIES,
      {},
    );
    expect(result).toEqual(mockResponse);
  });

  it('[getCategories] should return an empty array if no categories are found', async () => {
    const mockResponse: CategoryDto[] = [];

    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.getCategories();

    expect(mockMarkClientProxy.send).toHaveBeenCalledWith(
      MsgMarksEnum.CATEGORIES,
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

    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.createMark(mockRequestBody);

    const transformedResponse =
      FeatureTransformer.transformToFeatureDto(mockResponse);

    expect(mockMarkClientProxy.send).toHaveBeenCalledWith(
      MsgMarksEnum.CREATE_MARK,
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

    jest.spyOn(mockMarkClientProxy, 'send').mockReturnValue(of(mockResponse));

    const result = await controller.createMark(mockRequestBody);

    const transformedResponse =
      FeatureTransformer.transformToFeatureDto(mockResponse);

    expect(mockMarkClientProxy.send).toHaveBeenCalledWith(
      MsgMarksEnum.CREATE_MARK,
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
