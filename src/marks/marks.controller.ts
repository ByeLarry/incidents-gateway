import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MsgMarksEnum } from 'src/utils/msg.marks.enum';
import { ClientProxy } from '@nestjs/microservices';
import { CoordsDto } from './dto/coords.dto';
import { firstValueFrom } from 'rxjs';
import { VerifyMarkDto } from './dto/verify-mark.dto';
import { errorSwitch } from 'src/utils/errors';
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
import { HttpStatusExtends } from 'src/utils/extendsHttpStatus.enum';
import { MARKS_SERVICE_TAG } from 'src/utils/marks.service.provide';
import { FeatureTransformer } from 'src/utils/transform-to-feature';

@ApiTags('Marks')
@Controller('api/marks')
export class MarkController {
  constructor(
    @Inject(MARKS_SERVICE_TAG) private client: ClientProxy,
    private readonly marksGateway: MarksGateway,
  ) {}
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
    const res: MarkRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.MARK_GET }, data),
    );
    errorSwitch(res as string);
    return res;
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
    const res: MarkRecvDto[] | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.MAP_INIT }, data),
    );
    errorSwitch(res as string);
    return FeatureTransformer.transformToFeatureDto(res as MarkRecvDto[]);
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
  async verifyTrue(@Body() data: VerifyMarkDto) {
    const res: VerifiedRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.MARK_VERIFY_TRUE }, data),
    );
    errorSwitch(res as string);
    return res;
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
  @Post('verify/false')
  async verifyFalse(@Body() data: VerifyMarkDto) {
    const res: VerifiedRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.MARK_VERIFY_FALSE }, data),
    );
    errorSwitch(res as string);
    return res;
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
    const res: CategoryDto[] | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.CATEGORIES }, {}),
    );
    errorSwitch(res as string);
    return res;
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
  @Post('create')
  async createMark(@Body() data: CreateMarkDto) {
    const res: MarkRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.CREATE_MARK }, data),
    );
    errorSwitch(res as string);
    this.marksGateway.emitMessageToAll(
      'new-mark',
      FeatureTransformer.transformToFeatureDto(res as MarkRecvDto),
    );
    return FeatureTransformer.transformToFeatureDto(res as MarkRecvDto);
  }
}
