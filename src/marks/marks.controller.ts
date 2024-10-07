import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import { VerifiedRecvDto } from './dto/verified-recv.dto';
import { CategoryDto } from './dto/category.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { MarksGateway } from './marks.gateway';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { errorSwitch, MARKS_SERVICE_TAG } from '../libs/utils';
import { MicroserviceResponseStatus } from '../libs/dto';
import { MsgMarksEnum, RolesEnum } from '../libs/enums';
import { FeatureTransformer } from '../libs/helpers';
import { Public, Roles } from '../decorators';
import { RolesGuard } from '../guards';

type AsyncFunction<T> = () => Promise<T>;

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
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
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

  @Get()
  @Public()
  async getMarks(@Query() data: CoordsDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<MicroserviceResponseStatus | MarkRecvDto[]>(
        this.client.send(MsgMarksEnum.MAP_INIT, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    return FeatureTransformer.transformToFeatureDto(result as MarkRecvDto[]);
  }

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.USER)
  @Post('verify/true')
  async verifyTrue(@Body() data: VerifyMarkDto) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<MicroserviceResponseStatus | VerifiedRecvDto>(
        this.client.send(MsgMarksEnum.MARK_VERIFY_TRUE, data),
      );
    });
    errorSwitch(result as MicroserviceResponseStatus);
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.USER)
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

  @Get('categories')
  @Public()
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
