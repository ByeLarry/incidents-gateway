import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MsgMarksEnum, RolesEnum } from '../libs/enums';
import { CACHE_CATEGORIES_KEY, MARKS_SERVICE_TAG } from '../libs/utils';
import { ClientProxy } from '@nestjs/microservices';
import { Public, Roles } from '../decorators';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  Cache,
} from '@nestjs/cache-manager';
import { MicroserviceSender } from '../libs/helpers/microservice-sender';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../guards';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    @Inject(MARKS_SERVICE_TAG) private client: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('categories')
  @Public()
  @CacheKey(CACHE_CATEGORIES_KEY)
  @UseInterceptors(CacheInterceptor)
  async getCategories() {
    return await MicroserviceSender.send(
      this.client,
      MsgMarksEnum.CATEGORIES,
      {},
    );
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post('create')
  async createCategory(@Body() dto: CreateCategoryDto) {
    const result = await MicroserviceSender.send(
      this.client,
      MsgMarksEnum.CREATE_CATEGORY,
      dto,
    );
    this.cacheManager.del(CACHE_CATEGORIES_KEY);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Delete()
  async deleteCategory(@Query('id') id: string) {
    const result = await MicroserviceSender.send(
      this.client,
      MsgMarksEnum.DELETE_CATEGORY,
      { id: Number(id) },
    );
    this.cacheManager.del(CACHE_CATEGORIES_KEY);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch()
  async updateCategory(@Body() dto: UpdateCategoryDto) {
    const result = await MicroserviceSender.send(
      this.client,
      MsgMarksEnum.UPDATE_CATEGORY,
      dto,
    );
    this.cacheManager.del(CACHE_CATEGORIES_KEY);
    return result;
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('stats')
  async getStats() {
    return await MicroserviceSender.send(
      this.client,
      MsgMarksEnum.CATEGORIES_STATS,
      {},
    );
  }
}
