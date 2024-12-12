import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import {
  CategoriesPaginationDto,
  CategoriesStatsDto,
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dto';
import { CategoriesSortEnum } from '../../libs/enums';

export function ApiDocReindexCategoriesSearch(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Перестроение индекса поиска',
      description: `Этот эндпоинт позволяет инициировать процесс перестроения индекса поиска для категорий. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Индекс успешно перестроен.',
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
      description: 'Категорий нет в базе.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
    ApiBearerAuth(),
  );
}

export function ApiDocClearCategoriesCache(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Очистить кэш категорий',
      description: `Этот эндпоинт позволяет очистить кэш для категорий. Доступно только администраторам. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Кэш успешно очищен.',
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
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
    ApiBearerAuth(),
  );
}

export function ApiDocCategoriesSearch(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Поиск категорий',
      description: `Этот эндпоинт позволяет искать категории по строке запроса. Доступно только администраторам. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiQuery({
      name: 'query',
      type: String,
      required: true,
      description: 'Строка запроса для поиска категорий.',
      example: 'Авария',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Результаты поиска категорий.',
      type: [CategoryDto],
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректный запрос. Параметр "query" обязателен.',
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
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
    ApiBearerAuth(),
  );
}

export function ApiDocGetCategoriesStats(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Получение статистики категорий',
      description: `Возвращает статистику по категориям. Доступно только администраторам. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Статистика успешно получена.',
      type: CategoriesStatsDto,
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
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
    ApiBearerAuth(),
  );
}

export function ApiDocUpdateCategory(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Обновление категории',
      description: `Обновляет данные существующей категории. Доступно только администраторам. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiBody({
      description: 'Данные для обновления категории',
      type: UpdateCategoryDto,
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Категория успешно обновлена.',
      type: CategoryDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные данные для обновления категории.',
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
      description: 'Категория с указанным идентификатором не найдена.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
    ApiBearerAuth(),
  );
}

export function ApiDocDeleteCategory(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Удаление категории',
      description: `Удаляет категорию по идентификатору. Доступно только администраторам. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiQuery({
      name: 'id',
      type: String,
      required: true,
      description: 'Идентификатор категории, которую нужно удалить',
      example: '1',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Категория успешно удалена.',
      type: CategoryDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректный идентификатор категории.',
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
      description: 'Категория с указанным идентификатором не найдена.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
    ApiBearerAuth(),
  );
}

export function ApiDocCreateCategory(role: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Создание категории',
      description: `Создает новую категорию. Доступно только для администраторов. Доступен только пользователям с ролью ${role}.`,
    }),
    ApiBody({
      description: 'Данные для создания категории',
      type: CreateCategoryDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Категория успешно создана.',
      type: CategoryDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные данные для создания категории.',
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
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера.',
    }),
    ApiBearerAuth(),
  );
}

export function ApiDocCategoriesPagination() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получение списка категорий с пагинацией',
      description:
        'Возвращает список категорий с поддержкой пагинации. Вы можете указать параметры страницы и размера страницы через query-параметры.',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      required: true,
      description: 'Номер страницы для пагинации. Начинается с 1.',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: true,
      description: 'Количество элементов на странице.',
      example: 10,
    }),
    ApiQuery({
      name: 'sort',
      type: String,
      required: false,
      description: 'Поле для сортировки.',
      example: 'name',
      enum: CategoriesSortEnum,
    }),
    ApiResponse({
      status: 200,
      description: 'Успешный ответ с данными о категориях.',
      type: [CategoriesPaginationDto],
    }),
    ApiResponse({
      status: 400,
      description: 'Некорректные параметры пагинации.',
    }),
    ApiResponse({
      status: 500,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}

export function ApiDocGetCategories() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получение списка категорий',
      description: 'Возвращает список категорий, кэшируемых для оптимизации.',
    }),
    ApiResponse({
      status: 200,
      description: 'Список категорий успешно получен.',
      type: [CategoryDto],
    }),
    ApiResponse({
      status: 500,
      description: 'Внутренняя ошибка сервера.',
    }),
  );
}
