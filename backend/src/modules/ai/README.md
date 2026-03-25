# AI Module - Ollama Integration

Модуль для работы с локальной LLM через Ollama API.

## 📦 Компоненты

### OllamaService
Базовый сервис для подключения к Ollama:
- `generate(prompt, model)` - генерация ответа на промпт
- `isAvailable()` - проверка доступности API
- `getModels()` - получение списка моделей
- `getDefaultModel()` - модель по умолчанию

### NewsProcessorService
AI обработка новостей:
- `analyzeNews(text)` - извлекает заголовок, теги и очищает контент

### AIController
REST API endpoints:
- `GET /api/ai/health` - проверка статуса Ollama
- `POST /api/ai/analyze-news` - обработка текста новости
- `POST /api/ai/generate` - прямой запрос к модели

## ⚙️ Настройка

### .env переменные
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:4b
```

### Требования
1. Установленная Ollama: https://ollama.ai
2. Модель gemma3:4b (или другая):
   ```bash
   ollama pull gemma3:4b
   ```

## 🚀 Использование

### Проверка статуса
```bash
curl http://localhost:3000/api/ai/health
```

Ответ:
```json
{
  "ok": true,
  "isConfigured": true,
  "models": ["gemma3:4b", "llama2"],
  "defaultModel": "gemma3:4b"
}
```

### Обработка новости
```bash
curl -X POST http://localhost:3000/api/ai/analyze-news \
  -H "Content-Type: application/json" \
  -d '{
    "text": "#биатлон #поздравляем\n10 марта 2026 года в УО ВГУОР проходило Первенство..."
  }'
```

Ответ:
```json
{
  "ok": true,
  "data": {
    "title": "Биатлонисты победили на Первенстве Витебской области",
    "tags": ["биатлон", "поздравляем", "соревнования", "первенство", "витебск"],
    "content": "10 марта 2026 года в УО ВГУОР проходило Первенство..."
  }
}
```

### Прямой запрос к модели
```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Расскажи про преимущества локальных LLM",
    "model": "gemma3:4b"
  }'
```

## 🔧 Как это работает

### Промпт для анализа новости
```
Ты - помощник для обработки новостей из Telegram. Проанализируй текст и извлеки:

1. **Заголовок** - короткое название новости (до 100 символов)
2. **Теги** - массив ключевых слов/тем (3-7 тегов, без символа #)
3. **Контент** - основной текст новости БЕЗ хештегов

Правила:
- Теги должны быть релевантными теме новости
- Удаляй все хештеги из контента (даже слитные like #поздравляем10)
- Сохраняй эмодзи в контенте
- Форматируй ответ СТРОГО в JSON формате
```

### Fallback механизм
Если Ollama недоступен, используется regex обработка:
- Извлечение хештегов: `/(?:^|\s)#[\wа-яА-ЯёЁ_]+/g`
- Удаление хештегов: `replace(/(?:^|\s)#[\wа-яА-ЯёЁ_]+/g, '')`

## 📊 Интеграция с TelegramSyncService

При синхронизации новостей:
```typescript
const analysis = await this.newsProcessor.analyzeNews(message.text);

const createNewsDto = {
  title: analysis.title,      // AI заголовок
  content: analysis.content,  // Текст без хештегов
  tags: analysis.tags,        // AI теги
  // ...
};
```

## 🎯 Расширение

Модуль универсальный - можно добавлять новые endpoints:

```typescript
@Post('summarize')
async summarize(@Body('text') text: string) {
  const prompt = `Сделай краткое содержание текста (2-3 предложения):\n${text}`;
  const summary = await this.ollama.generate(prompt);
  return { ok: true, summary };
}

@Post('categorize')
async categorize(@Body('text') text: string) {
  const prompt = `Определи категорию новости (спорт/объявление/мероприятие):\n${text}`;
  const category = await this.ollama.generate(prompt);
  return { ok: true, category };
}
```

## 🐛 Troubleshooting

### Ollama не отвечает
```bash
# Проверить статус
ollama list

# Перезапустить сервис
ollama serve
```

### Модель не найдена
```bash
# Скачать модель
ollama pull gemma3:4b

# Проверить доступные
ollama list
```

### Долгая генерация
Увеличьте timeout в `ollama.service.ts`:
```typescript
timeout: 120000, // 2 минуты
```
