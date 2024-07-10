import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { MsgMarksEnum } from 'src/utils/msg.marks.enum';
import { ClientProxy } from '@nestjs/microservices';
import { CoordsDto } from './dto/coords.dto';
import { firstValueFrom } from 'rxjs';
import { transformToFeatureDto } from 'src/utils/transform-to-feature';
import { VerifyMarkDto } from './dto/verify-mark.dto';
import { errorSwitch } from 'src/utils/errors';
import { MarkDto } from './dto/mark.dto';
import { MarkRecvDto } from './dto/mark-recv.dto';

@Controller('api/marks')
export class MarkController {
  constructor(@Inject('MARKS_SERVICE') private client: ClientProxy) {}

  @Get('one')
  async getMark(@Query() data: MarkDto) {
    try {
      const res: MarkRecvDto | string = await firstValueFrom(
        this.client.send({ cmd: MsgMarksEnum.MARK_GET_SEND }, data),
      );
      errorSwitch(res as string);
      return res;
    } catch (e) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Get()
  async getMarks(@Query() data: CoordsDto) {
    try {
      const res: MarkRecvDto[] | string = await firstValueFrom(
        this.client.send({ cmd: MsgMarksEnum.MAP_INIT_SEND }, data),
      );
      errorSwitch(res as string);
      return transformToFeatureDto(res as MarkRecvDto[]);
    } catch (e) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Post('verify/true')
  async verifyTrue(@Body() data: VerifyMarkDto) {
    try {
      const res: { verified: number } | string = await firstValueFrom(
        this.client.send({ cmd: MsgMarksEnum.MARK_VERIFY_TRUE_SEND }, data),
      );
      errorSwitch(res as string);
      return res;
    } catch (e) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Post('verify/false')
  async verifyFalse(@Body() data: VerifyMarkDto) {
    try {
      const res: { verified: number } | string = await firstValueFrom(
        this.client.send({ cmd: MsgMarksEnum.MARK_VERIFY_FALSE_SEND }, data),
      );
      errorSwitch(res as string);
      return res;
    } catch (e) {
      throw new HttpException('Internal server error', 500);
    }
  }
}
