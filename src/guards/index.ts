import { GoogleGuard } from './google.guard';
import { RolesGuard } from './role.guard';
import { YandexGuard } from './yandex.guard';

export * from './role.guard';
export * from './google.guard';
export * from './jwt-auth.guard';

export const GUARDS = [RolesGuard, GoogleGuard, YandexGuard];
