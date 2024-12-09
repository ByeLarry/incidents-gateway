import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { YANDEX_STRATEGY_NAME } from '../../user/strategies';

@Injectable()
export class YandexGuard extends AuthGuard(YANDEX_STRATEGY_NAME) {}
