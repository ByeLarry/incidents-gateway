# API-шлюз

## Описание

Данный репозиторий содержит реализацию API-шлюза, входящего в состав проекта ***incidents***.
API-шлюз выступает в качестве посредника между клиентской частью приложения и микросервисами. 
Помимо проксирования запросов, в задачи шлюза входит логирование, обеспечения связи независимых микросервисов и логика авторизации.

## Установка

### Локально
```bash
# Установка зависимостей
npm install

# Запуск в dev режиме
npm run start:dev
```

### Docker 
```bash
# Создание и запуск docker сервисов
docker-compose up -d
```

## Проектирование

Стоит отметить, что в логике авторизации и логике входа в аккаунт сервер рассматривается как савокупность API-шлюза и микросервиса авторизации.

_Диаграммы можно сохранять и редактировать в ***[draw.io](https://app.diagrams.net/)***_

- ### Схема алгоритма JWT авторизации
  ![JWT](https://github.com/user-attachments/assets/fdb79e51-fa62-451b-95a0-95cd6aefc855)

- ### Схема алгоритма OAuth авторизации
  ![Authorization Code Grant](https://github.com/user-attachments/assets/ba56743c-4d7d-4a5d-9776-d20ff7e19235)

- ### Коммуникация клиента и сервера с использованием **HTTP** и **брокера сообщений**
  ![HTTP response  Коммуникация клиента и сервера](https://github.com/user-attachments/assets/8c1fbd9a-3698-4e6a-97a8-a4107672b326)

- ### Коммуникация клиента и сервера с использованием **HTTP**, **брокера сообщений** и **WebSocket**
  ![HTTP   WebSocket responses  Коммуникация клиента и сервера](https://github.com/user-attachments/assets/853b4672-fe61-445d-8fb1-e9bee8e726e0)

- ### Компоненты API-шлюза
  ![Компоненты API шлюза](https://github.com/user-attachments/assets/81645f40-de02-4e47-b058-0b7212b0818d)


## Документация API

Ниже представлена документация **Swagger**.

- ### Эндпоинты API
  ![Документация Swagger](https://github.com/user-attachments/assets/56879047-ac05-43e1-acc6-956c98c3702b)

## Ссылки

### Репозитории
- #### Клиентская часть:  *https://github.com/ByeLarry/incidents-frontend*  [![incidents-frontend](https://github.com/ByeLarry/incidents-frontend/actions/workflows/incidents-frontend.yml/badge.svg)](https://github.com/ByeLarry/incidents-frontend/actions/workflows/incidents-frontend.yml)
- #### API-шлюз:  *https://github.com/ByeLarry/incidents-gateway*  [![incidents-gateway](https://github.com/ByeLarry/incidents-gateway/actions/workflows/incidents-gateway.yml/badge.svg)](https://github.com/ByeLarry/incidents-gateway/actions/workflows/incidents-gateway.yml)
- #### Сервис авторизации:  *https://github.com/ByeLarry/incidents-auth-service*  [![incidents-auth](https://github.com/ByeLarry/incidents-auth-service/actions/workflows/incidents-auth.yml/badge.svg)](https://github.com/ByeLarry/incidents-auth-service/actions/workflows/incidents-auth.yml)
- #### Сервис марок (инцидентов): *https://github.com/ByeLarry/indcidents-marks-service*  [![incidents-marks](https://github.com/ByeLarry/incidents-marks-service/actions/workflows/incidents-marks.yml/badge.svg)](https://github.com/ByeLarry/incidents-marks-service/actions/workflows/incidents-marks.yml)
- #### Сервис поиска *https://github.com/ByeLarry/incidents-search-service*  [![incidents-search](https://github.com/ByeLarry/incidents-search-service/actions/workflows/incidents-search.yml/badge.svg)](https://github.com/ByeLarry/incidents-search-service/actions/workflows/incidents-search.yml)
- #### Панель администратора *https://github.com/ByeLarry/incidents-admin-frontend.git*  [![incidents-admin-frontend](https://github.com/ByeLarry/incidents-admin-frontend/actions/workflows/incidents-admin-frontend.yml/badge.svg)](https://github.com/ByeLarry/incidents-admin-frontend/actions/workflows/incidents-admin-frontend.yml)
- #### Сервис мониторинга состояния системы: *https://github.com/ByeLarry/incidents-healthcheck*  [![incidents-healthcheck](https://github.com/ByeLarry/incidents-healthcheck/actions/workflows/incidents-healthcheck.yml/badge.svg)](https://github.com/ByeLarry/incidents-healthcheck/actions/workflows/incidents-healthcheck.yml)
- #### Telegram бот для уведомления о состоянии системы *https://github.com/ByeLarry/incidents-healthcheck-bot*
- #### Сквозные (end-to-end) тесты *https://github.com/ByeLarry/incidents-playwright*

### Демонстрация функционала
- #### Демонастрация функционала пользовательской части версии 0.1.0: *https://youtu.be/H0-Qg97rvBM*
- #### Демонастрация функционала пользовательской части версии 0.2.0: *https://youtu.be/T33RFvfTxNU*
- #### Демонастрация функционала панели администратора версии 0.1.0: *https://youtu.be/7LTnEMYuzUo*



