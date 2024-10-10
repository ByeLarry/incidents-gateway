import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { MsgMarksEnum } from '../libs/enums';
import { MARKS_SERVICE_TAG } from '../libs/utils';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from '../decorators';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { MicroserviceSender } from '../libs/helpers/microservice-sender';

@Controller('categories')
export class CategoriesController {
  constructor(@Inject(MARKS_SERVICE_TAG) private client: ClientProxy) {}

  @Get('categories')
  @Public()
  @CacheKey('categories')
  @UseInterceptors(CacheInterceptor)
  async getCategories() {
    return await MicroserviceSender.send(
      this.client,
      MsgMarksEnum.CATEGORIES,
      {},
    );
  }

  @Get('stats')
  async getStats() {
    return await MicroserviceSender.send(
      this.client,
      MsgMarksEnum.CATEGORIES_STATS,
      {},
    );
  }
}
