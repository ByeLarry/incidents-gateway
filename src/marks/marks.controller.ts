import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
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
import { MARKS_SERVICE_TAG, SEARCH_SERVICE_TAG } from '../libs/utils';
import { MicroserviceResponseStatus } from '../libs/dto';
import { MsgMarksEnum, RolesEnum } from '../libs/enums';
import { FeatureTransformer } from '../libs/helpers';
import { Public, Roles } from '../decorators';
import { RolesGuard } from '../guards';
import { WebSocketMessageEnum } from '../libs/enums/websocket-message.enum';
import { ApiTags } from '@nestjs/swagger';
import { MicroserviceSenderService } from '../libs/services';

@ApiTags('marks')
@Controller('marks')
export class MarkController {
  constructor(
    @Inject(MARKS_SERVICE_TAG) private client: ClientProxy,
    private readonly marksGateway: MarksGateway,
    @Inject(SEARCH_SERVICE_TAG) private searchClient: ClientProxy,
    private readonly senderService: MicroserviceSenderService,
  ) {}
  @Public()
  @Get('one')
  async getMark(@Query() data: MarkDto) {
    return this.senderService.send(this.client, MsgMarksEnum.MARK_GET, data);
  }

  @Get()
  @Public()
  async getMarks(@Query() data: CoordsDto) {
    const result = await this.senderService.send<
      CoordsDto,
      MicroserviceResponseStatus | MarkRecvDto[]
    >(this.client, MsgMarksEnum.MAP_INIT, data);
    return FeatureTransformer.transformToFeatureDto(result as MarkRecvDto[]);
  }

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.USER)
  @Post('verify/true')
  async verifyTrue(@Body() data: VerifyMarkDto) {
    return this.senderService.send(
      this.client,
      MsgMarksEnum.MARK_VERIFY_TRUE,
      data,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.USER)
  @Post('verify/false')
  async verifyFalse(@Body() data: VerifyMarkDto) {
    return this.senderService.send(
      this.client,
      MsgMarksEnum.MARK_VERIFY_FALSE,
      data,
    );
  }

  @Post('create')
  async createMark(@Body() data: CreateMarkDto) {
    const result = await this.senderService.send<
      CreateMarkDto,
      MicroserviceResponseStatus | MarkRecvDto
    >(this.client, MsgMarksEnum.CREATE_MARK, data);
    this.marksGateway.emitMessageToAll(
      WebSocketMessageEnum.NEW_MARK,
      FeatureTransformer.transformToFeatureDto(result as MarkRecvDto),
    );
    return FeatureTransformer.transformToFeatureDto(result as MarkRecvDto);
  }

  @Get('all')
  @Public()
  async getAllMarks() {
    const result = await this.senderService.send(
      this.client,
      MsgMarksEnum.GET_ALL_MARKS,
      {},
    );
    return FeatureTransformer.transformToFeatureDto(result as MarkRecvDto[]);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async deleteMark(@Param('id') id: string) {
    const result = await this.senderService.send(
      this.client,
      MsgMarksEnum.DELETE_MARK,
      Number(id),
    );
    this.marksGateway.emitMessageToAll(
      WebSocketMessageEnum.DELETE_MARK,
      FeatureTransformer.transformToFeatureDto(result as MarkRecvDto),
    );
    return FeatureTransformer.transformToFeatureDto(result as MarkRecvDto);
  }
}
