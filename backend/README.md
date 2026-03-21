# Backend - NestJS API для СДЮШОР "Олимпиец"

Бэкенд для получения новостей из Telegram-канала и сохранения их в PostgreSQL.

## 📋 Требования

- Node.js >= 20
- Docker & Docker Compose
- Telegram Bot Token
- Telegram Channel ID

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
yarn install
```

### 2. Настройка окружения

```bash
# Скопируйте файл окружения
cp .env.example .env

# Отредактируйте .env и добавьте ваши данные
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=your_channel_id
```

### 3. Запуск PostgreSQL через Docker

```bash
# Только PostgreSQL
docker-compose up -d postgres

# Или всё сразу (postgres + backend)
docker-compose up -d
```

### 4. Запуск приложения

```bash
# Development mode
yarn start:dev

# Production mode
yarn build && yarn start:prod

# Docker
docker-compose up --build
```

## 📡 API Endpoints

### Новости

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/news` | Получить все новости с пагинацией |
| GET | `/api/news/latest` | Получить последние новости |
| GET | `/api/news/:id` | Получить новость по ID |
| POST | `/api/news` | Создать новость |
| PUT | `/api/news/:id` | Обновить новость |
| DELETE | `/api/news/:id` | Удалить новость |

### Telegram

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/telegram/health` | Проверка бота |
| GET | `/api/telegram/status` | Статус синхронизации |
| POST | `/api/telegram/sync` | Запустить синхронизацию |
| GET | `/api/telegram/channel` | Информация о канале |

## 🔧 Настройка Telegram

### 1. Создание бота

1. Откройте [@BotFather](https://t.me/botfather)
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте токен

### 2. Добавление бота в канал

1. Откройте ваш канал
2. Добавьте бота как администратора (только чтение)
3. Узнайте ID канала:
   - Отправьте любое сообщение в канал
   - Перешлите сообщение в бот [@userinfobot](https://t.me/userinfobot)
   - Скопируйте ID (начинается с `-100`)

### 3. Настройка .env

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHANNEL_ID=-1001234567890
```

## 🗄️ База данных

### Сущность News

```typescript
{
  id: string;              // UUID
  telegramId: number;      // ID сообщения в Telegram
  title: string;           // Заголовок
  content: string;         // Текст новости
  imageUrl?: string;       // URL изображения
  videoUrl?: string;       // URL видео
  hasMedia: boolean;       // Есть ли медиа
  postDate: Date;          // Дата публикации в Telegram
  views: number;           // Количество просмотров
  createdAt: Date;         // Дата создания в БД
  updatedAt: Date;         // Дата обновления
}
```

## 🔄 Синхронизация

Синхронизация происходит:
- Автоматически каждые 5 минут (Cron)
- Вручную через `POST /api/telegram/sync`
- При старте приложения (последние сообщения)

## 🐳 Docker

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f backend

# Остановка
docker-compose down

# Пересоздание контейнеров
docker-compose down && docker-compose up -d --build
```

## 📝 Примеры запросов

### Получить новости

```bash
curl http://localhost:3000/api/news?page=1&limit=10
```

### Запустить синхронизацию

```bash
curl -X POST http://localhost:3000/api/telegram/sync
```

### Получить последние новости

```bash
curl http://localhost:3000/api/news/latest?limit=5
```

## 🛠️ Технологии

- **NestJS** - фреймворк
- **TypeORM** - ORM для PostgreSQL
- **PostgreSQL** - база данных
- **Axios** - HTTP клиент
- **Cron** - планировщик задач

## 📁 Структура проекта

```
backend/
├── src/
│   ├── modules/
│   │   ├── news/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   ├── news.controller.ts
│   │   │   ├── news.service.ts
│   │   │   └── news.module.ts
│   │   └── telegram/
│   │       ├── interfaces/
│   │       ├── telegram.controller.ts
│   │       ├── telegram.service.ts
│   │       ├── telegram-sync.service.ts
│   │       └── telegram.module.ts
│   ├── app.module.ts
│   └── main.ts
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🔐 Безопасность

- Валидация всех входящих данных (class-validator)
- CORS настроен только для frontend URL
- Переменные окружения для чувствительных данных

## 📄 Лицензия

MIT
