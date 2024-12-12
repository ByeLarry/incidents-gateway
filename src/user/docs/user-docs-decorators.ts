import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AccessTokenDto, UserAndTokensDto, UserDto } from '../dto';

export function ApiDocUserSignUp() {
  return applyDecorators(
    ApiOperation({
      summary: 'Регистрация пользователя',
      description:
        'Обрабатывает запрос на регистрацию нового пользователя. Включает проверку reCAPTCHA, создание учетной записи и возвращение токенов аутентификации.',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description:
        'Успешная регистрация пользователя, возвращает данные пользователя и токены.',
      type: UserAndTokensDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка валидации данных, переданных пользователем.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Невалидный токен reCAPTCHA.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Пользователь с таким email уже существует.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocUserSignIn() {
  return applyDecorators(
    ApiOperation({
      summary: 'Авторизация пользователя',
      description:
        'Обрабатывает запрос на авторизацию пользователя. Включает проверку reCAPTCHA, вход в систему с использованием email и пароля, и возвращение токенов аутентификации.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description:
        'Успешный вход пользователя в систему, возвращает данные пользователя и токены.',
      type: UserAndTokensDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка валидации данных, переданных пользователем.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Невалидные учетные данные пользователя или ошибка при проверке reCAPTCHA.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Пользователь не найден.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocGetUser(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить информацию о текущем пользователе',
      description: `Этот эндпоинт используется для получения информации о текущем пользователе, проверяя refresh токен и user agent. В случае успешной проверки возвращает данные о пользователе. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: HttpStatus.OK,
      type: UserAndTokensDto,
      description: 'Информация о текущем пользователе.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Не удалось получить информацию о пользователе из-за отсутствия refresh токена или некорректного user agent.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocRefreshTokens() {
  return applyDecorators(
    ApiOperation({
      summary: 'Обновление токенов доступа',
      description: `Этот эндпоинт используется для обновления токенов доступа. Для этого необходимо передать refresh токен в cookie и user agent для аутентификации. В случае успешного обновления возвращает новый access токен.`,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Токен доступа был успешно обновлен.',
      type: AccessTokenDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Не удалось обновить токены из-за отсутствия refresh токена или некорректного user agent.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Пользователь не найден.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocLogout(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Выход пользователя из системы',
      description: `Этот метод выполняет выход пользователя из системы, удаляя его refresh token и очищая соответствующие данные сессии. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Успешный выход, если refresh токен не был найден или удален.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Не удалось обновить токены из-за отсутствия refresh токена или некорректного user agent.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Ошибка, если токен не был найден, но произошла внутренняя ошибка.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocDeleteUser(role: string) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Удаление пользователя',
      description: `Этот метод удаляет пользователя из системы. Требуется предоставление access токена в заголовке и ID пользователя в запросе. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiQuery({
      name: 'userId',
      description: 'ID пользователя, которого нужно удалить.',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      type: UserDto,
      description: 'Пользователь успешно удален.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Ошибка авторизации. Токен доступа не предоставлен или некорректен.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Пользователь не найден.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description:
        'Пользователь не может быть удален, так как он является администратором.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Доступ запрещен.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Ошибка запроса. Отсутствуют необходимые параметры для удаления.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

