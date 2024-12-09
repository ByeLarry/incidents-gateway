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
  ![Компоненты API шлюза](https://github.com/user-attachments/assets/450b472a-5367-4755-ad6c-8ee0470345a4)


## Документация API

Ниже представлена документация API-шлюза, с использованием **Swagger**.

- ### Эндпоинты API
  ![API-шлюз документация Swagger](https://github.com/user-attachments/assets/532dab0c-fe30-4c1e-9bdf-3c1eb3fb9a77)

- ### Схемы DTO
  ![API-шлюз документация Swagger схемы DTO](https://github.com/user-attachments/assets/38f7786a-5e3b-4491-bffe-c2d8d039f910)

## Ссылки

- #### Клиентская часть:  *https://github.com/ByeLarry/incidents-frontend*
- #### Сервис авторизации:  *https://github.com/ByeLarry/incidents-auth-service*
- #### Сервис марок (инцидентов): *https://github.com/ByeLarry/indcidents-marks-service*
- #### Сервис поиска *https://github.com/ByeLarry/incidents-search-service*
- #### Панель администратора *https://github.com/ByeLarry/incidents-admin-frontend.git*
- #### Демонастрация функционала пользовательской части версии 0.1.0: *https://youtu.be/H0-Qg97rvBM*
- #### Демонастрация функционала пользовательской части версии 0.2.0: *https://youtu.be/T33RFvfTxNU*
- #### Демонастрация функционала панели администратора версии 0.1.0: *https://youtu.be/7LTnEMYuzUo*



