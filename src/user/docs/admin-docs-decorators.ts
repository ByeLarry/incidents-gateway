import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  AdminLoginDto,
  CreateUserDto,
  UpdateAdminDto,
  UserAndTokensDto,
  UserDto,
  UserIdDto,
  UsersPaginationDto,
  UsersStatsDto,
} from '../dto';
import { UsersSortEnum } from '../../libs/enums';

export function ApiDocGetUsersPagination(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить пользователей с пагинацией',
      description: `Этот эндпоинт используется для получения списка пользователей с пагинацией. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'page',
      description: 'Номер страницы для пагинации.',
      required: true,
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Количество пользователей на странице.',
      required: true,
      type: Number,
    }),
    ApiQuery({
      name: 'sort',
      type: String,
      required: false,
      description: 'Поле для сортировки.',
      example: 'name',
      enum: UsersSortEnum,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список пользователей с пагинацией.',
      type: [UsersPaginationDto],
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Необходимо пройти аутентификацию с валидным токеном.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные входные данные.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Требуется роль ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocBlockUser(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Блокировка пользователя',
      description: `Этот эндпоинт используется для блокировки пользователя по его ID. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiBearerAuth(),
    ApiBody({
      description: 'Данные пользователя для блокировки',
      type: UserIdDto,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Пользователь успешно заблокирован.',
      type: UserDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Необходимо пройти аутентификацию с валидным токеном.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные входные данные.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Доступ запрещен. Требуется роль ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Пользователь является администратором.',
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

export function ApiDocUnblockUser(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Разблокировка пользователя',
      description: `Этот эндпоинт используется для разблокировки пользователя по его ID. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiBearerAuth(),
    ApiBody({
      description: 'Данные пользователя для разблокировки',
      type: UserIdDto,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Пользователь успешно разблокирован.',
      type: UserDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Необходимо пройти аутентификацию с валидным токеном.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные входные данные.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Доступ запрещен. Требуется роль ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Пользователь не найден.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocUpdateAdmin(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Обновление данных администратора',
      description: `Этот эндпоинт используется для обновления данных администратора. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiBearerAuth(),
    ApiBody({
      description: 'Данные для обновления администратора',
      type: UpdateAdminDto,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Данные администратора успешно обновлены.',
      type: UserAndTokensDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Необходимо пройти аутентификацию с валидным токеном.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Доступ запрещен. Требуется роль ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Неверные данные для обновления.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Администратор не найден.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocCreateUserByAdmin(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Создание пользователя администратором',
      description: `Этот эндпоинт используется для создания нового пользователя. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiBearerAuth(),
    ApiBody({
      description: 'Данные для создания нового пользователя',
      type: CreateUserDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      type: UserDto,
      description: 'Пользователь успешно создан.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Необходимо пройти аутентификацию с валидным токеном.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Пользователь с таким email уже существует.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Доступ запрещен. Требуется роль ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные данные для создания пользователя.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocDeleteUserByAdmin(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Удаление пользователя администратором',
      description: `Этот эндпоинт используется для удаления пользователя по его ID. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      description: 'ID пользователя, которого необходимо удалить.',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Доступ запрещен. Требуется роль ${role}.`,
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

export function ApiDocAddAdminRoleToUser(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Назначение роли администратора пользователю',
      description: `Этот эндпоинт используется для назначения роли администратора пользователю. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiBearerAuth(),
    ApiBody({
      description: 'Данные для назначения роли администратора',
      type: UserIdDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      type: UserDto,
      description: 'Роль администратора успешно назначена пользователю.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Необходимо пройти аутентификацию с валидным токеном.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Доступ запрещен. Требуется роль ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные данные для назначения роли.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Пользователь уже имеет роль администратора.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Пользователь не найден.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocGetUsersStats(role: string) {
    return applyDecorators(
      ApiOperation({
        summary: 'Получить статистику пользователей',
        description: `Этот эндпоинт используется для получения статистики пользователей. Доступ ограничен пользователями с ролью ${role}.`,
      }),
      ApiBearerAuth(),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Статистика пользователей успешно получена.',
        type: UsersStatsDto, 
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Необходимо пройти аутентификацию с валидным токеном.',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `Доступ запрещен. Требуется роль ${role}.`,
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Внутренняя ошибка сервера.',
      }),
    );
  }

  export function ApiDocSearchUsers(role: string) {
    return applyDecorators(
      ApiOperation({
        summary: 'Поиск пользователей',
        description: `Этот эндпоинт используется для поиска пользователей по запросу. Доступ ограничен пользователями с ролью ${role}.`,
      }),
      ApiBearerAuth(),
      ApiQuery({
        name: 'query',
        description: 'Строка запроса для поиска пользователей.',
        required: true,
        type: String,
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Результаты поиска пользователей.',
        type: [UserDto], 
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Некорректные данные запроса.',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Необходимо пройти аутентификацию с валидным токеном.',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `Доступ запрещен. Требуется роль ${role}.`,
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Внутренняя ошибка сервера.',
      }),
    );
  }
  
  export function ApiDocAdminLogin() {
    return applyDecorators(
      ApiOperation({
        summary: 'Авторизация администратора',
        description: 'Этот эндпоинт используется для авторизации администратора с передачей данных для входа и получения токенов. Доступ открыт для всех пользователей.',
      }),
      ApiBody({
        description: 'Данные для авторизации администратора',
        type: AdminLoginDto,
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешный вход администратора с получением токенов.',
        type: UserAndTokensDto,
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Некорректные данные для авторизации.',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Неверные учетные данные или токен.',
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
  
  export function ApiDocReindexUsersSearch(role: string) {
    return applyDecorators(
      ApiOperation({
        summary: 'Перестроение индекса поиска',
        description: `Этот эндпоинт используется для перестроения индекса поиска пользователей. Доступ ограничен пользователями с ролью ${role}.`,
      }),
      ApiBearerAuth(),
      ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Индекс поиска успешно перестроен.',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Необходимо пройти аутентификацию с валидным токеном.',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Пользователей нет в базе.',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `Доступ запрещен. Требуется роль ${role}.`,
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Внутренняя ошибка сервера.',
      }),
    );
  }
  