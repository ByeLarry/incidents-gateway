import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FeatureDto, MarkRecvDto, VerifiedRecvDto } from '../dto';

export function ApiDocGetMark() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получение метки',
      description:
        'Этот эндпоинт позволяет получить метку по запросу. Доступно для всех пользователей.',
    }),
    ApiQuery({
      name: 'userId',
      type: String,
      required: true,
      description: 'Идентификатор пользователя.',
    }),
    ApiQuery({
      name: 'markId',
      type: Number,
      required: true,
      description: 'Идентификатор точки.',
    }),
    ApiQuery({
      name: 'lat',
      type: Number,
      required: true,
      description: 'Широта.',
    }),
    ApiQuery({
      name: 'lng',
      type: Number,
      required: true,
      description: 'Долгота.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Метка успешно найдена.',
      type: MarkRecvDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректный запрос. Параметры запроса обязателны.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocGetMarks() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получение меток на карте',
      description:
        'Этот эндпоинт позволяет получить список меток на карте по данным координатам. Доступен для всех пользователей.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Успешно получены метки.',
      type: [FeatureDto],
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные данные координат.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
    ApiQuery({
      name: 'lat',
      type: Number,
      required: true,
      description: 'Широта.',
    }),
    ApiQuery({
      name: 'lng',
      type: Number,
      required: true,
      description: 'Долгота.',
    }),
  );
}

export function ApiDocVerifyMark(role: string) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Подтверждение метки как верной',
      description: `Этот эндпоинт позволяет пользователю подтвердить метку как верную. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Метка успешно подтверждена.',
      type: VerifiedRecvDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Пользователь не авторизован.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Доступ запрещен. Требуется роль ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные данные для подтверждения метки.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocUnverifyMark(role: string) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Отмена подтверждения метки как верной',
      description: `Этот эндпоинт позволяет пользователю отменить подтверждение метки как верной. Доступ ограничен пользователями с ролью ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Метка успешно отклонена.',
      type: VerifiedRecvDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Пользователь не авторизован.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Доступ запрещен. Требуется роль ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные данные для отмены подтверждения метки.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocCreateMark(role: string) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Создание новой метки',
      description: `Этот эндпоинт позволяет создать новую метку на карте. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Метка успешно создана.',
      type: MarkRecvDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Пользователь не авторизован.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Доступ запрещен. Требуется роль ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные данные для создания метки.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocGetAllMarks(role: string) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Получить все метки',
      description: `Эндпоинт позволяет администраторам получить полный список всех меток. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список всех меток успешно получен.',
      type: [MarkRecvDto],
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Пользователь не авторизован.',
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

export function ApiDocDeleteMark(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Удалить метку',
      description: `Эндпоинт позволяет администраторам удалить метку по её идентификатору. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Идентификатор метки, которую необходимо удалить.',
      required: true,
      example: '42',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Метка успешно удалена.',
      type: MarkRecvDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректный идентификатор метки.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Пользователь не авторизован.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Доступ запрещен. Только для администраторов.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Метка с указанным идентификатором не найдена.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocSearchMarks() {
  return applyDecorators(
    ApiOperation({
      summary: 'Поиск меток',
      description:
        'Эндпоинт выполняет поиск меток по указанному запросу в индексе меток.',
    }),
    ApiQuery({
      name: 'query',
      type: String,
      description: 'Поисковый запрос для поиска меток.',
      required: true,
      example: 'example search query',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Успешный поиск. Возвращает массив результатов.',
      type: [MarkRecvDto],
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректный формат поискового запроса.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocReindexMarksSearch(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Реиндексация поисковой системы',
      description: `Эндпоинт инициирует процесс реиндексации данных в поисковой системе. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Реиндексация выполнена успешно.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Пользователь не авторизован.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Происшествий нет в базе. ',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'Доступ запрещен. Только администраторы могут выполнять реиндексацию.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}
