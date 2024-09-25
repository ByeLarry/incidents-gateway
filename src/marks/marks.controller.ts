import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CoordsDto } from './dto/coords.dto';
import { firstValueFrom } from 'rxjs';
import { VerifyMarkDto } from './dto/verify-mark.dto';
import { MarkDto } from './dto/mark.dto';
import { MarkRecvDto } from './dto/mark-recv.dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerifiedRecvDto } from './dto/verified-recv.dto';
import { CategoryDto } from './dto/category.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { FeatureDto } from './dto/feature.dto';
import { MarksGateway } from './marks.gateway';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { errorSwitch, MARKS_SERVICE_TAG } from '../libs/utils';
import { MicroserviceResponseStatus } from '../libs/dto';
import { HttpStatusExtends, MsgMarksEnum } from '../libs/enums';
import { FeatureTransformer } from '../libs/helpers';
import { AuthGuard } from '../guards';

type AsyncFunction<T> = () => Promise<T>;

@ApiTags('Marks')
@Controller('marks')
export class MarkController {
  constructor(
    @Inject(MARKS_SERVICE_TAG) private client: ClientProxy,
    private readonly marksGateway: MarksGateway,
  ) {}

  private async handleAsyncOperation<T>(
    operation: AsyncFunction<T>,
  ): Promise<T | MicroserviceResponseStatus> {
    try {
      return await operation();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatusExtends.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get one mark' })
  @ApiResponse({
    status: HttpStatusExtends.OK,
    description: 'Mark',
    type: MarkRecvDto,
  })
  @ApiResponse({
    status: HttpStatusExtends.NOT_FOUND,
    description: 'Mark not found',
  })
  @ApiResponse({
    status: HttpStatusExtends.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Get('one')
  async getMark(@Query() data: MarkDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<MicroserviceResponseStatus | MarkRecvDto>(
        this.client.send(MsgMarksEnum.MARK_GET, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    return result;
  }

  @ApiOperation({ summary: 'Get nearest marks' })
  @ApiResponse({
    status: HttpStatusExtends.OK,
    description: 'Marks',
    type: [FeatureDto],
  })
  @ApiResponse({
    status: HttpStatusExtends.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Get()
  async getMarks(@Query() data: CoordsDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<MicroserviceResponseStatus | MarkRecvDto[]>(
        this.client.send(MsgMarksEnum.MAP_INIT, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    return FeatureTransformer.transformToFeatureDto(result as MarkRecvDto[]);
  }

  @ApiOperation({ summary: 'Verify mark true' })
  @ApiBody({ type: VerifyMarkDto })
  @ApiResponse({
    status: HttpStatusExtends.OK,
    description: 'Mark verified',
    type: VerifiedRecvDto,
  })
  @ApiResponse({
    status: HttpStatusExtends.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatusExtends.NOT_FOUND,
    description: 'Mark not found',
  })
  @ApiResponse({
    status: HttpStatusExtends.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatusExtends.FORBIDDEN,
    description: 'CSRF token is missing',
  })
  @ApiResponse({
    status: HttpStatusExtends.SESSION_EXPIRED,
    description: 'Session expired',
  })
  @ApiCookieAuth()
  @Post('verify/true')
  @UseGuards(AuthGuard)
  async verifyTrue(@Body() data: VerifyMarkDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<MicroserviceResponseStatus | VerifiedRecvDto>(
        this.client.send(MsgMarksEnum.MARK_VERIFY_TRUE, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    return result;
  }

  @ApiOperation({ summary: 'Verify mark false' })
  @ApiBody({ type: VerifyMarkDto })
  @ApiResponse({
    status: HttpStatusExtends.OK,
    description: 'Mark verified',
    type: FeatureDto,
  })
  @ApiResponse({
    status: HttpStatusExtends.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatusExtends.NOT_FOUND,
    description: 'Mark not found',
  })
  @ApiResponse({
    status: HttpStatusExtends.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatusExtends.FORBIDDEN,
    description: 'CSRF token is missing',
  })
  @ApiResponse({
    status: HttpStatusExtends.SESSION_EXPIRED,
    description: 'Session expired',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post('verify/false')
  async verifyFalse(@Body() data: VerifyMarkDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<MicroserviceResponseStatus | VerifiedRecvDto>(
        this.client.send(MsgMarksEnum.MARK_VERIFY_FALSE, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    return result;
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: HttpStatusExtends.OK,
    description: 'Marks',
    type: [CategoryDto],
  })
  @ApiResponse({
    status: HttpStatusExtends.NOT_FOUND,
    description: 'Categories not found',
  })
  @ApiResponse({
    status: HttpStatusExtends.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Get('categories')
  @CacheKey('categories')
  @UseInterceptors(CacheInterceptor)
  async getCategories() {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<MicroserviceResponseStatus | CategoryDto[]>(
        this.client.send(MsgMarksEnum.CATEGORIES, {}),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    return result;
  }

  @ApiOperation({ summary: 'Create mark' })
  @ApiBody({ type: VerifyMarkDto })
  @ApiResponse({
    status: HttpStatusExtends.CREATED,
    description: 'Mark created',
    type: FeatureDto,
  })
  @ApiResponse({
    status: HttpStatusExtends.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatusExtends.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatusExtends.FORBIDDEN,
    description: 'CSRF token is missing',
  })
  @ApiResponse({
    status: HttpStatusExtends.SESSION_EXPIRED,
    description: 'Session expired',
  })
  @ApiResponse({
    status: HttpStatusExtends.NOT_FOUND,
    description: 'User not found',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post('create')
  async createMark(@Body() data: CreateMarkDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<MicroserviceResponseStatus | MarkRecvDto>(
        this.client.send(MsgMarksEnum.CREATE_MARK, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    this.marksGateway.emitMessageToAll(
      'new-mark',
      FeatureTransformer.transformToFeatureDto(result as MarkRecvDto),
    );
    return FeatureTransformer.transformToFeatureDto(result as MarkRecvDto);
  }
}
