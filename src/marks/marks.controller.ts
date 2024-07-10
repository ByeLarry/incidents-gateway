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
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerifiedRecvDto } from './dto/verified-recv.dto';

@ApiTags('Marks')
@Controller('api/marks')
export class MarkController {
  constructor(@Inject('MARKS_SERVICE') private client: ClientProxy) {}

  @ApiOperation({ summary: 'Get one mark' })
  @ApiQuery({ type: MarkDto })
  @ApiResponse({
    status: 200,
    description: 'Mark',
    type: MarkRecvDto,
  })
  @ApiResponse({ status: 404, description: 'Mark not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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

  @ApiOperation({ summary: 'Get nearest marks' })
  @ApiQuery({ type: CoordsDto })
  @ApiResponse({
    status: 200,
    description: 'Marks',
    type: [MarkRecvDto],
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
    try {
      const res: VerifiedRecvDto | string = await firstValueFrom(
        this.client.send({ cmd: MsgMarksEnum.MARK_VERIFY_TRUE_SEND }, data),
      );
      errorSwitch(res as string);
      return res;
    } catch (e) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @ApiOperation({ summary: 'Verify mark false' })
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
  @Post('verify/false')
  async verifyFalse(@Body() data: VerifyMarkDto) {
    try {
      const res: VerifiedRecvDto | string = await firstValueFrom(
        this.client.send({ cmd: MsgMarksEnum.MARK_VERIFY_FALSE_SEND }, data),
      );
      errorSwitch(res as string);
      return res;
    } catch (e) {
      throw new HttpException('Internal server error', 500);
    }
  }
}
