import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
  Headers,
  UseGuards,
  Put,
} from '@nestjs/common';
import { Public, Roles, UserAgent } from '../libs/decorators';
import {  IndexesEnum, MsgAuthEnum, RolesEnum } from '../libs/enums';
import { RolesGuard } from '../libs/guards';
import { PaginationDto } from '../libs/dto';
import { Response } from 'express';
import { AUTH_SERVICE_TAG } from '../libs/utils';
import { ClientProxy } from '@nestjs/microservices';
import {
  AddAdminDto,
  AdminLoginDto,
  CreateUserDto,
  SearchDto,
  UpdateAdminDto,
  UserAndTokensDto,
  UserIdAndAccessTokenValueDto,
  UserIdDto,
} from '../user/dto';
import { MicroserviceSenderService } from '../libs/services';
import { ResponseService } from './response.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('auth/admin')
export class AdminController {
  constructor(
    @Inject(AUTH_SERVICE_TAG) private readonly client: ClientProxy,
    private readonly senderService: MicroserviceSenderService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('users')
  async getUsers(@Query() dto: PaginationDto) {
    return this.senderService.send(this.client, MsgAuthEnum.GET_ALL_USERS, dto);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('block')
  async blockUser(@Body() dto: UserIdDto) {
    return this.senderService.send(this.client, MsgAuthEnum.BLOCK_USER, dto);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('unblock')
  async unblockUser(@Body() dto: UserIdDto) {
    return this.senderService.send(this.client, MsgAuthEnum.UNBLOCK_USER, dto);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch()
  async updateAdmin(
    @Body() dto: UpdateAdminDto,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = (await this.senderService.send(
      this.client,
      MsgAuthEnum.UPDATE_ADMIN,
      { ...dto, userAgent },
    )) as UserAndTokensDto;
    this.responseService.setTokensInResponse(res, tokens);
    return { user, accessToken: tokens.accessToken };
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post('create-user')
  async createUserByAdmin(@Body() dto: CreateUserDto) {
    return this.senderService.send(
      this.client,
      MsgAuthEnum.CREATE_USER_BY_ADMIN,
      dto,
    );
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteUserByAdmin(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @Headers('authorization') accessToken: string,
  ) {
    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const data: UserIdAndAccessTokenValueDto = {
      accessTokenValue: accessToken.replace('Bearer ', ''),
      userId: id,
    };

    await this.senderService.send(this.client, MsgAuthEnum.DELETE, data);
    res.status(HttpStatus.NO_CONTENT);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('add')
  async addAdminRoleToUser(@Body() dto: AddAdminDto) {
    return this.senderService.send(
      this.client,
      MsgAuthEnum.ADD_ADMIN_ROLE_TO_USER,
      dto,
    );
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('stats')
  async getStats() {
    return this.senderService.send(this.client, MsgAuthEnum.USERS_STATS, {});
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('search')
  async search(@Query('query') query: string) {
    const searchDto: SearchDto = { query, index: IndexesEnum.USERS };
    return this.senderService.send(
      this.client,
      MsgAuthEnum.SEARCH_USERS,
      searchDto,
    );
  }

  @Public()
  @Post('login')
  async adminLogin(
    @Body() data: AdminLoginDto,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const adminData: AdminLoginDto = { ...data, userAgent };
    const { user, tokens } = (await this.senderService.send(
      this.client,
      MsgAuthEnum.ADMIN_LOGIN,
      adminData,
    )) as UserAndTokensDto;
    this.responseService.setTokensInResponse(res, tokens);
    return { user, accessToken: tokens.accessToken };
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Put('reindex')
  async reindexSearchEngine() {
    return this.senderService.send(this.client, MsgAuthEnum.REINDEX, {});
  }
}
