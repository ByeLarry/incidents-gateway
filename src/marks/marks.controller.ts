import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CoordsDto } from './dto/coords.dto';
import { VerifyMarkDto } from './dto/verify-mark.dto';
import { MarkDto } from './dto/mark.dto';
import { MarkRecvDto } from './dto/mark-recv.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { MarksGateway } from './marks.gateway';
import {  MARKS_SERVICE_TAG } from '../libs/utils';
import { MicroserviceResponseStatus } from '../libs/dto';
import { MsgMarksEnum, RolesEnum } from '../libs/enums';
import { FeatureTransformer } from '../libs/helpers';
import { Public, Roles } from '../decorators';
import { RolesGuard } from '../guards';
import { MicroserviceSender } from '../libs/helpers/microservice-sender';

@Controller('marks')
export class MarkController {
  constructor(
    @Inject(MARKS_SERVICE_TAG) private client: ClientProxy,
    private readonly marksGateway: MarksGateway,
  ) {}
  @Public()
  @Get('one')
  async getMark(@Query() data: MarkDto) {
    return MicroserviceSender.send(this.client, MsgMarksEnum.MARK_GET, data);
  }

  @Get()
  @Public()
  async getMarks(@Query() data: CoordsDto) {
    const result = await MicroserviceSender.send<
      CoordsDto,
      MicroserviceResponseStatus | MarkRecvDto[]
    >(this.client, MsgMarksEnum.MAP_INIT, data);
    return FeatureTransformer.transformToFeatureDto(result as MarkRecvDto[]);
  }

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.USER)
  @Post('verify/true')
  async verifyTrue(@Body() data: VerifyMarkDto) {
    return MicroserviceSender.send(
      this.client,
      MsgMarksEnum.MARK_VERIFY_TRUE,
      data,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.USER)
  @Post('verify/false')
  async verifyFalse(@Body() data: VerifyMarkDto) {
    return MicroserviceSender.send(
      this.client,
      MsgMarksEnum.MARK_VERIFY_FALSE,
      data,
    );
  }

  @Post('create')
  async createMark(@Body() data: CreateMarkDto) {
    const result = await MicroserviceSender.send<
      CreateMarkDto,
      MicroserviceResponseStatus | MarkRecvDto
    >(this.client, MsgMarksEnum.MARK_GET, data);
    return FeatureTransformer.transformToFeatureDto(result as MarkRecvDto);
  }
}
