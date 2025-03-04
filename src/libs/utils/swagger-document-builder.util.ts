import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerDocumentBuilder = new DocumentBuilder()
  .setTitle('Incidents API')
  .setVersion('0.1.1')
  .setDescription(
    `Ниже представлено краткое описание API, являющееся точкой входа в систему Incidents. 
    \n\n
    Этот API предназначен для того, чтобы помочь как администраторам, так и обычным пользователям взаимодействовать с данными в системе Incidents. 
    API поддерживает операции CRUD для инцидентов, категорий, пользователей и других аспектов, а также предоставляет возможности для работы со статистикой.
    \n\n
    Основные возможности:
    - Создание, чтение, обновление и удаление инцидентов, категорий и пользователей.
    - Функции администратора для управления пользователями, ролями и правами доступа.
    - Эндпоинты для получения статистической сводки по инцидентам, категориям и ползователям.
    - Эндпоинты для реиндексации поискового сервиса.
    - Взаимодействие пользователей с системой через создание инцидентов, просмотр данных и получения актуальной информации.
    - Аутентификация с использованием JWT или OAuth.
    \n\n
    Аутентификация:
    - Некоторые эндпоинты защищены и требуют аутентификацию. Используйте Bearer токен в заголовке Authorization.`
  )
  
  .addBearerAuth({in: 'header', type: 'http', scheme: 'bearer', bearerFormat: 'JWT'})
