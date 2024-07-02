# API-шлюз

## Описание

Данный репозиторий содержит реализацию API-шлюза, входящего в состав проекта ***incidents***.
API-шлюз выступает в качестве посредника между клиентской частью приложения и микросервисами. 
Помимо проксирования запросов, в задачи шлюза входит логирование, обеспечения связи независимых микросервисов и логика авторизации.

## Установка

```bash
# Установка зависимостей
npm install

# Запуск в dev режиме
npm run start:dev
```

## Проектирование

Стоит отметить, что в логике авторизации и логике входа в аккаунт сервер рассматривается как савокупность API-шлюза и микросервиса авторизации.

_Диаграммы можно сохранять и редактировать в ***[draw.io](https://app.diagrams.net/)***_

- ### Логика авторизации
  ![Логика авторизации](https://github.com/ByeLarry/incidents-getaway/assets/120035099/a7467b8d-0d3c-4563-a24b-e962d6c93431)

- ### Логика входа в аккаунт
  ![Логика входа в аккаунт](https://github.com/ByeLarry/incidents-getaway/assets/120035099/15b28dbf-acbd-415d-a43a-a91d675ba757)
