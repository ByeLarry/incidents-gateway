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

- ### Логика авторизации
  ![Логика авторизации](https://github.com/user-attachments/assets/481fe2e6-893c-4cdc-98e7-a3adb1b102b2)

- ### Логика входа в аккаунт
  ![Логика входа в аккаунт](https://github.com/user-attachments/assets/67e0861b-abd3-435f-96dc-a5744827eaae)

- ### Гвард авторизации
  ![Мидлвер авторизации](https://github.com/user-attachments/assets/d0fc7450-0ea2-473a-97a4-155a64b443da)

- ### Рефреш мидлвер
  ![Рефреш мидлвер](https://github.com/user-attachments/assets/11d0cbbd-29c0-482a-83f6-c3703a819758)


## Документация API
![image](https://github.com/user-attachments/assets/9c59f42f-6cbd-43de-8435-78274efe1bd2)

## Ссылки

- #### Клиентская часть:  *https://github.com/ByeLarry/incidents-frontend*
- #### Сервис авторизации:  *https://github.com/ByeLarry/incidents-auth-service*
- #### Сервис марок (инцидентов): *https://github.com/ByeLarry/indcidents-marks-service*
- #### Демонастрация функционала версии 0.1.0: *https://youtu.be/H0-Qg97rvBM*



