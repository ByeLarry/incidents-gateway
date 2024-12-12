import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserAndTokensDto } from '../dto';

export function ApiDocGoogleAuth() {
  return applyDecorators(
    ApiOperation({
      summary: 'Авторизация через Google',
      description:
        'Инициирует процесс авторизации через Google. Пользователь перенаправляется на страницу входа Google.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Перенаправление на страницу авторизации Google.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Не удалось пройти авторизацию через Google.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocGoogleAuthCallback() {
  return applyDecorators(
    ApiOperation({
      summary: 'Обработка колбэка авторизации через Google',
      description:
        'Обрабатывает ответ от Google после успешной авторизации. Если авторизация успешна, перенаправляет пользователя на указанный URL с параметрами токена, имени и фамилии.',
    }),
    ApiResponse({
      status: HttpStatus.FOUND,
      description:
        'Пользователь перенаправлен на указанный URL с параметрами токена, имени и фамилии.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Авторизация не удалась, пользователь не найден в запросе.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocGoogleAuthSuccess() {
  return applyDecorators(
    ApiOperation({
      summary: 'Успешная обработка авторизации через Google',
      description:
        'Принимает параметры авторизации, проверяет токен через Google API, создает или обновляет учетную запись пользователя, устанавливает токены в ответ и возвращает данные пользователя.',
    }),
    ApiQuery({
      name: 'token',
      description: 'Токен авторизации, полученный от Google, закодированный.',
      required: true,
    }),
    ApiQuery({
      name: 'name',
      description: 'Имя пользователя, закодированное.',
      required: true,
    }),
    ApiQuery({
      name: 'surname',
      description: 'Фамилия пользователя, закодированная.',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Возвращает информацию о пользователе и токен доступа.',
      type: UserAndTokensDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Ошибка авторизации из-за недействительного токена.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Ошибка взаимодействия с микросервисами или Google API.',
    }),
  );
}


export function ApiDocYandexAuth() {
  return applyDecorators(
    ApiOperation({
      summary: 'Авторизация через Yandex',
      description:
        'Инициирует процесс авторизации через Yandex. Пользователь перенаправляется на страницу входа Yandex.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Перенаправление на страницу авторизации Yandex.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Не удалось пройти авторизацию через Yandex.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocYandexAuthCallback() {
  return applyDecorators(
    ApiOperation({
      summary: 'Обработка колбэка авторизации через Yandex',
      description:
        'Обрабатывает ответ от Yandex после успешной авторизации. Если авторизация успешна, перенаправляет пользователя на указанный URL с параметрами токена, имени и фамилии.',
    }),
    ApiResponse({
      status: HttpStatus.FOUND,
      description:
        'Пользователь перенаправлен на указанный URL с параметрами токена, имени и фамилии.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Авторизация не удалась, пользователь не найден в запросе.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocYandexAuthSuccess() {
  return applyDecorators(
    ApiOperation({
      summary: 'Успешная обработка авторизации через Yandex',
      description:
        'Принимает параметры авторизации, проверяет токен через Yandex API, создает или обновляет учетную запись пользователя, устанавливает токены в ответ и возвращает данные пользователя.',
    }),
    ApiQuery({
      name: 'token',
      description: 'Токен авторизации, полученный от Yandex, закодированный.',
      required: true,
    }),
    ApiQuery({
      name: 'name',
      description: 'Имя пользователя, закодированное.',
      required: true,
    }),
    ApiQuery({
      name: 'surname',
      description: 'Фамилия пользователя, закодированная.',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Возвращает информацию о пользователе и токен доступа.',
      type: UserAndTokensDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Ошибка авторизации из-за недействительного токена.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Ошибка взаимодействия с микросервисами или Yandex API.',
    }),
  );
}
