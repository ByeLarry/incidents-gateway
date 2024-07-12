import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { MsgMarksEnum } from 'src/utils/msg.marks.enum';
import { ClientProxy } from '@nestjs/microservices';
import { CoordsDto } from './dto/coords.dto';
import { firstValueFrom } from 'rxjs';
import { transformToFeatureDto } from 'src/utils/transform-to-feature';
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

@ApiTags('Marks')
@Controller('api/marks')
export class MarkController {
  constructor(
    @Inject('MARKS_SERVICE') private client: ClientProxy,
    private readonly marksGateway: MarksGateway,
  ) {}
  @ApiOperation({ summary: 'Get one mark' })
  @ApiResponse({
    status: 200,
    description: 'Mark',
    type: MarkRecvDto,
  })
  @ApiResponse({ status: 404, description: 'Mark not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('one')
  async getMark(@Query() data: MarkDto) {
    const res: MarkRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.MARK_GET_SEND }, data),
    );
    errorSwitch(res as string);
    return res;
  }

  @ApiOperation({ summary: 'Get nearest marks' })
  @ApiResponse({
    status: 200,
    description: 'Marks',
    type: [FeatureDto],
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get()
  async getMarks(@Query() data: CoordsDto) {
    const res: MarkRecvDto[] | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.MAP_INIT_SEND }, data),
    );
    errorSwitch(res as string);
    return transformToFeatureDto(res as MarkRecvDto[]);
  }

  @ApiOperation({ summary: 'Verify mark true' })
  @ApiBody({ type: VerifyMarkDto })
  @ApiResponse({
    status: 200,
    description: 'Mark verified',
    type: VerifiedRecvDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'Mark not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'CSRF token is missing' })
  @ApiResponse({ status: 419, description: 'Session expired' })
  @ApiCookieAuth()
  @Post('verify/true')
  async verifyTrue(@Body() data: VerifyMarkDto) {
    const res: VerifiedRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.MARK_VERIFY_TRUE_SEND }, data),
    );
    errorSwitch(res as string);
    return res;
  }

  @ApiOperation({ summary: 'Verify mark false' })
  @ApiBody({ type: VerifyMarkDto })
  @ApiResponse({
    status: 200,
    description: 'Mark verified',
    type: FeatureDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'Mark not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'CSRF token is missing' })
  @ApiResponse({ status: 419, description: 'Session expired' })
  @ApiCookieAuth()
  @Post('verify/false')
  async verifyFalse(@Body() data: VerifyMarkDto) {
    const res: VerifiedRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.MARK_VERIFY_FALSE_SEND }, data),
    );
    errorSwitch(res as string);
    return res;
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Marks',
    type: [CategoryDto],
  })
  @ApiResponse({ status: 404, description: 'Categories not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('categories')
  async getCategories() {
    const res: CategoryDto[] | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.CATEGORIES_SEND }, {}),
    );
    errorSwitch(res as string);
    return res;
  }

  @ApiOperation({ summary: 'Create mark' })
  @ApiBody({ type: VerifyMarkDto })
  @ApiResponse({
    status: 201,
    description: 'Mark created',
    type: FeatureDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'CSRF token is missing' })
  @ApiResponse({ status: 419, description: 'Session expired' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiCookieAuth()
  @Post('create')
  async createMark(@Body() data: CreateMarkDto) {
    const res: MarkRecvDto | string = await firstValueFrom(
      this.client.send({ cmd: MsgMarksEnum.CREATE_MARK_SEND }, data),
    );
    errorSwitch(res as string);
    this.marksGateway.emitMessageToAll(
      'new-mark',
      transformToFeatureDto(res as MarkRecvDto),
    );
    return transformToFeatureDto(res as MarkRecvDto);
  }
}
