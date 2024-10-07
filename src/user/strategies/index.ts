import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { YandexStrategy } from './yandex.strategy';

export * from './google.strategy';
export * from './yandex.strategy';
export * from './jwt.strategy';

export const STRATEGIES = [GoogleStrategy, JwtStrategy, YandexStrategy];
