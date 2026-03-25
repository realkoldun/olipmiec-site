#!/bin/bash
# Скрипт инициализации Ollama - загружает нужную модель при первом запуске

echo "🦙 Ожидание запуска Ollama..."

# Ждём пока Ollama запустится
until curl -s http://ollama:11434/api/tags > /dev/null 2>&1; do
  echo "  → Ollama ещё не готова..."
  sleep 5
done

echo "✅ Ollama запущена!"

# Проверяем наличие модели
MODEL="gemma3:4b"
echo "📥 Проверка модели $MODEL..."

if ollama list | grep -q "$MODEL"; then
  echo "✅ Модель $MODEL уже установлена"
else
  echo "⬇️  Загрузка модели $MODEL..."
  ollama pull $MODEL
  echo "✅ Модель $MODEL загружена!"
fi

echo "🎉 Ollama готова к работе!"
