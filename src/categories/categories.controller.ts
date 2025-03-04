import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IndexesEnum, MsgCategoriesEnum, RolesEnum } from '../libs/enums';
import { CACHE_CATEGORIES_KEY, MARKS_SERVICE_TAG } from '../libs/utils';
import { ClientProxy } from '@nestjs/microservices';
import { Public, Roles } from '../libs/decorators';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  Cache,
} from '@nestjs/cache-manager';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../libs/guards';
import { MicroserviceSenderService } from '../libs/services';
import { SearchDto } from '../user/dto';
import { PaginationDto } from '../libs/dto';
import {
  ApiDocCategoriesPagination,
  ApiDocCategoriesSearch,
  ApiDocClearCategoriesCache,
  ApiDocCreateCategory,
  ApiDocDeleteCategory,
  ApiDocGetCategories,
  ApiDocGetCategoriesStats,
  ApiDocReindexCategoriesSearch,
  ApiDocUpdateCategory,
} from './docs';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    @Inject(MARKS_SERVICE_TAG) private client: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly senderService: MicroserviceSenderService,
  ) {}

  @ApiDocGetCategories()
  @Get()
  @Public()
  @CacheKey(CACHE_CATEGORIES_KEY)
  @UseInterceptors(CacheInterceptor)
  async getCategories() {
    return await this.senderService.send(
      this.client,
      MsgCategoriesEnum.CATEGORIES,
      {},
    );
  }

  @ApiDocCategoriesPagination()
  @Get('pagination')
  @Public()
  async getCategoriesWithPagination(@Query() dto: PaginationDto) {
    return await this.senderService.send(
      this.client,
      MsgCategoriesEnum.CATEGORIES_PAGINATION,
      dto,
    );
  }

  @ApiDocCreateCategory(RolesEnum.ADMIN)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post('create')
  async createCategory(@Body() dto: CreateCategoryDto) {
    const result = await this.senderService.send(
      this.client,
      MsgCategoriesEnum.CREATE_CATEGORY,
      dto,
    );
    this.cacheManager.del(CACHE_CATEGORIES_KEY);
    return result;
  }

  @ApiDocDeleteCategory(RolesEnum.ADMIN)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Delete()
  async deleteCategory(@Query('id') id: string) {
    const result = await this.senderService.send(
      this.client,
      MsgCategoriesEnum.DELETE_CATEGORY,
      { id: Number(id) },
    );
    this.cacheManager.del(CACHE_CATEGORIES_KEY);
    return result;
  }

  @ApiDocUpdateCategory(RolesEnum.ADMIN)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch()
  async updateCategory(@Body() dto: UpdateCategoryDto) {
    const result = await this.senderService.send(
      this.client,
      MsgCategoriesEnum.UPDATE_CATEGORY,
      dto,
    );
    this.cacheManager.del(CACHE_CATEGORIES_KEY);
    return result;
  }

  @ApiDocGetCategoriesStats(RolesEnum.ADMIN)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('stats')
  async getStats() {
    return await this.senderService.send(
      this.client,
      MsgCategoriesEnum.CATEGORIES_STATS,
      {},
    );
  }

  @ApiDocCategoriesSearch(RolesEnum.ADMIN)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('search')
  async search(@Query() queries: { query: string }) {
    const searchDto: SearchDto = {
      query: queries.query,
      index: IndexesEnum.CATEGORIES,
    };
    return await this.senderService.send(
      this.client,
      MsgCategoriesEnum.SEARCH_CATEGORIES,
      searchDto,
    );
  }

  @ApiDocClearCategoriesCache(RolesEnum.ADMIN)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('clear-cache')
  async clearCache() {
    this.cacheManager.del(CACHE_CATEGORIES_KEY);
    return HttpStatus.NO_CONTENT;
  }

  @ApiDocReindexCategoriesSearch(RolesEnum.ADMIN)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Put('admin/reindex')
  async reindexSearhchEngine() {
    return await this.senderService.send(
      this.client,
      MsgCategoriesEnum.REINDEX,
      {},
    );
  }
}
