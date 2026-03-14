---
name: main
description: Скилл описывает разработку приложения
---

📋 Детальный план разработки веб-приложения для СДЮШОР "Олимпиец"
🎯 Общая информация о проекте

Заказчик СДЮШОР "Олимпиец", г. Витебск
Пользователь Заместитель директора + посетители сайта
Тип проекта Курсовой/Дипломный проект
Для курсовой Только фронтенд с моковыми данными
Для полной версии Fullstack (Next.js + NestJS + PostgreSQL)

Структура проекта

projectv/
├── frontend/                    # Next.js приложение
│   ├── src/
│   │   ├── app/                 # App Router
│   │   │   ├── (main)/          # Основная layouts
│   │   │   │   ├── page.tsx     # Главная страница
│   │   │   │   ├── news/        # Новости
│   │   │   │   ├── sections/    # Секции
│   │   │   │   ├── trainers/    # Тренеры
│   │   │   │   ├── honor-board/ # Почётная доска
│   │   │   │   ├── documents/   # Документы
│   │   │   │   └── search/      # Поиск
│   │   │   ├── api/             # API routes (для моков)
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/              # Базовые UI компоненты
│   │   │   ├── layout/          # Header, Footer, Sidebar
│   │   │   ├── news/            # Компоненты новостей
│   │   │   ├── accessibility/   # Доступность (лупа, голос)
│   │   │   ├── search/          # Поиск
│   │   │   └── modules/         # Модульные компоненты
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API сервисы (mock/real)
│   │   ├── stores/              # State management (Zustand)
│   │   ├── types/               # TypeScript типы
│   │   ├── utils/               # Утилиты
│   │   ├── styles/              # Глобальные стили
│   │   └── mocks/               # Моковые данные
│   ├── public/
│   ├── .eslintrc.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # NestJS приложение (для полной версии)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── news/
│   │   │   ├── sections/
│   │   │   ├── trainers/
│   │   │   ├── users/
│   │   │   └── search/
│   │   ├── common/
│   │   ├── config/
│   │   └── main.ts
│   ├── test/
│   └── package.json
│
└── docs/                        # Документация
├── requirements.md
├── api-spec.md
└── deployment.md


План разработки (Поэтапный)
Этап 1: Инициализация проекта (День 1-2)
# Создание Next.js проекта
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir

# Установка зависимостей
cd frontend
npm install zustand @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install next-themes @tanstack/react-query
npm install -D @types/node @typescript-eslint/eslint-plugin

Инициализировать Next.js проект
Настроить ESLint конфигурацию
Настроить Tailwind CSS
Вместе с этим не забыть о мобильной верстке
Настроить path aliases (@/components, @/utils и т.д.)
Создать базовую структуру папок
Настроить Git repository

Этап 2: Базовая архитектура и UI Kit (День 3-5)
2.1 Создание дизайн-системы
// src/components/ui/button.tsx
// src/components/ui/card.tsx
// src/components/ui/input.tsx
// src/components/ui/select.tsx
// src/components/ui/modal.tsx

2.2 Настройка темизации
// src/providers/theme-provider.tsx
// Поддержка светлой/тёмной темы
// Контрастность для доступности

Чек-лист этапа 2:
Создать базовые UI компоненты (Button, Card, Input, Select)
Настроить цветовую палитру (основные цвета клуба)
Создать типографику (размеры шрифтов для доступности)
Настроить темную/светлую тему
Создать Storybook для компонентов обязательно

Этап 3: Layout и навигация (День 6-8)
3.1 Структура layout
// src/app/layout.tsx
// src/components/layout/header.tsx
// src/components/layout/footer.tsx
// src/components/layout/sidebar.tsx
// src/components/layout/mobile-nav.tsx

const navigationItems = [
{ label: 'Главная', href: '/' },
{ label: 'Новости', href: '/news' },
{ label: 'Секции', href: '/sections' },
{ label: 'Тренеры', href: '/trainers' },
{ label: 'Почётная доска', href: '/honor-board' },
{ label: 'Документы', href: '/documents' },
{ label: 'Контакты', href: '/contacts' },
];

Чек-лист этапа 3:
Создать Header с логотипом и навигацией
Создать Footer с контактной информацией
Реализовать адаптивное меню (бургер для мобильных)
Добавить хлебные крошки (breadcrumbs)
Реализовать активные состояния ссылок


Этап 4: Система доступности (День 9-12) ⭐ Ключевая фича!!!
4.1 Компоненты доступности
// src/components/accessibility/
├── accessibility-panel.tsx      // Панель настроек доступности
├── text-resizer.tsx             // Изменение размера текста
├── magnifier.tsx                // Лупа
├── voice-reader.tsx             # Озвучка текста
├── contrast-toggle.tsx          // Переключение контраста
└── use-accessibility.ts         // Hook для управления

4.2 Реализация лупы
// src/components/accessibility/magnifier.tsx
import { useState, useRef } from 'react';

export function Magnifier() {
const [zoom, setZoom] = useState(1);
const [position, setPosition] = useState({ x: 0, y: 0 });

// Реализация увеличительного стекла
}

4.3 Озвучка текста (Web Speech API)
// src/hooks/use-speech-synthesis.ts
export function useSpeechSynthesis() {
const speak = (text: string) => {
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'ru-RU';
utterance.rate = 0.9;
speechSynthesis.speak(utterance);
};

const stop = () => speechSynthesis.cancel();

return { speak, stop, isSupported: 'speechSynthesis' in window };
}

4.4 Изменение размера текста
// src/stores/accessibility-store.ts
import { create } from 'zustand';

interface AccessibilityState {
fontSize: number;
contrast: 'normal' | 'high' | 'dark';
zoom: number;
setFontSize: (size: number) => void;
setContrast: (mode: string) => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
fontSize: 16,
contrast: 'normal',
zoom: 1,
setFontSize: (size) => set({ fontSize: size }),
setContrast: (mode) => set({ contrast: mode }),
}));

Чек-лист этапа 4:
Создать панель доступности (плавающая кнопка)
Реализовать изменение размера текста (3 уровня)
Реализовать лупу с перемещением
Реализовать озвучку текста (кнопка "прочитать")
Добавить режим высокой контрастности
Сохранять настройки в localStorage
Протестировать с скринридерами


Этап 5: Система поиска (День 13-16) ⭐ Ключевая фича
5.1 Архитектура поиска
// src/components/search/
├── search-bar.tsx               // Поисковая строка
├── search-results.tsx           // Результаты поиска
├── search-highlight.tsx         // Подсветка совпадений
└── use-search.ts                // Hook для поиска

5.2 Индексация контента
// src/services/search-index.ts
interface SearchIndex {
id: string;
type: 'news' | 'section' | 'trainer' | 'document';
title: string;
content: string;
tags: string[];
url: string;
}

class SearchService {
private index: SearchIndex[] = [];

add(item: SearchIndex) {
this.index.push(item);
}

search(query: string): SearchIndex[] {
const normalizedQuery = query.toLowerCase();
return this.index.filter(item =>
item.title.toLowerCase().includes(normalizedQuery) ||
item.content.toLowerCase().includes(normalizedQuery) ||
item.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
);
}
}

5.3 Поиск с учётом морфологии (упрощённо)
// src/utils/search-utils.ts
export function normalizeText(text: string): string {
return text
.toLowerCase()
.replace(/ё/g, 'е')
.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
.trim();
}

export function calculateRelevance(query: string, content: string): number {
// Простая релевантность по совпадениям
}

Чек-лист этапа 5:
Создать поисковую строку в header
Реализовать поиск по всем типам контента
Добавить подсветку найденных слов
Реализовать фильтрацию результатов по типу
Добавить историю поиска
Реализовать "горячие клавиши" (Ctrl+K)
Добавить автодополнение (autocomplete)
поиск будет проходить на моках, но в последующем будет отправляться запрос на поиск на бек


Этап 6: Модульная система контента (День 17-22)
6.1 Новости
// src/app/(main)/news/page.tsx
// src/components/news/news-list.tsx
// src/components/news/news-card.tsx
// src/components/news/news-detail.tsx

6.2 Секции
// src/app/(main)/sections/page.tsx
// src/components/sections/section-list.tsx
// src/components/sections/section-card.tsx
// src/components/sections/section-detail.tsx

6.3 Тренеры
// src/app/(main)/trainers/page.tsx
// src/components/trainers/trainer-list.tsx
// src/components/trainers/trainer-card.tsx

6.4 Почётная доска
// src/app/(main)/honor-board/page.tsx
// src/components/honor-board/honor-list.tsx
// src/components/honor-board/honor-card.tsx

6.5 Документы
// src/app/(main)/documents/page.tsx
// src/components/documents/document-list.tsx
// src/components/documents/document-download.tsx

Чек-лист этапа 6:
Создать страницу новостей с фильтрацией
Создать страницу секций с категориями
Создать страницу тренеров с фото
Создать почётную доску
Создать раздел документов
Реализовать пагинацию
Добавить sharing (соцсети)


Этап 7: Моковые данные (День 23-24)

// src/mocks/news.mock.ts
export const mockNews = [
{
id: '1',
title: 'Победа на областных соревнованиях',
content: '...',
date: '2025-01-15',
image: '/images/news-1.jpg',
author: 'Иванов И.И.',
},
// ...
];

// src/mocks/trainers.mock.ts
export const mockTrainers = [
{
id: '1',
name: 'Петров П.П.',
section: 'Футбол',
experience: 15,
photo: '/images/trainer-1.jpg',
},
// ...
];

// src/mocks/sections.mock.ts
export const mockSections = [
{
id: '1',
name: 'Футбол',
ageGroup: '7-15 лет',
schedule: 'Пн, Ср, Пт 17:00-19:00',
trainer: 'Петров П.П.',
},
// ...
];

Чек-лист этапа 7:
Создать моковые данные для всех разделов
Создать faker-генераторы для тестовых данных
Настроить API mock сервис
Добавить минимум 20 записей в каждый раздел

Этап 8: State Management (День 25-26)
// src/stores/
├── accessibility-store.ts       // Настройки доступности
├── search-store.ts              // Состояние поиска
├── news-store.ts                // Состояние новостей
├── ui-store.ts                  // UI состояния (модальные окна и т.д.)
└── index.ts                     // Экспорты

// Пример store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NewsState {
news: NewsItem[];
loading: boolean;
error: string | null;
fetchNews: () => Promise<void>;
}

export const useNewsStore = create<NewsState>()(
persist(
(set) => ({
news: [],
loading: false,
error: null,
fetchNews: async () => {
set({ loading: true });
// Fetch logic
},
}),
{ name: 'news-storage' }
)
);

Чек-лист этапа 8:
Настроить Zustand stores
Реализовать persist для настроек
Создать типы для всех stores
Добавить error handling

Этап 9: Адаптивность и тестирование (День 27-30)
/* Tailwind breakpoints */
/* sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px */

9.2 Тестирование доступности
WCAG 2.1 AA compliance
Keyboard navigation
Screen reader testing
Color contrast checking

9.3 Производительность
// next.config.js
module.exports = {
images: {
formats: ['image/avif', 'image/webp'],
},
experimental: {
optimizePackageImports: ['lucide-react'],
},
};

Чек-лист этапа 9:
Протестировать на мобильных устройствах
Проверить работу с клавиатурой
Оптимизировать изображения
Настроить lazy loading
Проверить Lighthouse score (>90)
Протестировать в разных браузерах


Этап 10: Документация и деплой (День 31-32)
# docs/README.md
# docs/ACCESSIBILITY.md
# docs/SEARCH.md
# docs/MODULES.md
# docs/DEPLOYMENT.md

Чек-лист этапа 10:
Написать README для проекта
Документировать API (если будет бэкенд)
Создать инструкцию для администратора
Настроить Vercel/Netlify деплой
Подготовить презентацию для защиты


🔧 3. Технические спецификации
3.1 Конфигурация Next.js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: true,
swcMinify: true,
images: {
remotePatterns: [
{ protocol: 'https', hostname: '**' },
],
},
experimental: {
serverComponentsExternalPackages: ['sharp'],
},
};

module.exports = nextConfig;

3.2 ESLint конфигурация


🎨 4. Дизайн-система
4.1 Цветовая палитра
// src/styles/colors.ts
export const colors = {
primary: {
50: '#eff6ff',
500: '#3b82f6',
700: '#1d4ed8',
900: '#1e3a8a',
},
secondary: {
500: '#10b981',
700: '#047857',
},
accent: {
500: '#f59e0b',
700: '#b45309',
},
// Для доступности
highContrast: {
background: '#000000',
text: '#FFFFFF',
link: '#FFFF00',
},
};

4.2 Типографика
// src/styles/typography.ts
export const typography = {
fontSizes: {
xs: '0.75rem',    // 12px
sm: '0.875rem',   // 14px
base: '1rem',     // 16px (default)
lg: '1.125rem',   // 18px
xl: '1.25rem',    // 20px
'2xl': '1.5rem',  // 24px
'3xl': '1.875rem',// 30px
'4xl': '2.25rem', // 36px
},
// Для доступности - увеличенные размеры
accessibilitySizes: {
normal: 1,
large: 1.25,
xlarge: 1.5,
},
};

📊 5. Модульная архитектура
5.1 Принципы модульности
┌─────────────────────────────────────────────────────────┐
│                    Application Shell                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   News   │  │ Sections │  │ Trainers │  │ Search  │ │
│  │  Module  │  │  Module  │  │  Module  │  │ Module  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
├─────────────────────────────────────────────────────────┤
│              Shared Components & Utilities               │
├─────────────────────────────────────────────────────────┤
│              State Management & API Layer                │
└─────────────────────────────────────────────────────────┘


5.2 Интерфейсы модулей

// src/types/module.ts
export interface ModuleConfig {
id: string;
name: string;
path: string;
enabled: boolean;
permissions?: string[];
}

export interface ModuleProps {
config: ModuleConfig;
data?: any;
onUpdate?: (data: any) => void;
}

🔍 6. Детальная спецификация поиска
6.1 Типы поисковых запросов
// src/types/search.ts
export type SearchType =
| 'news'
| 'section'
| 'trainer'
| 'document'
| 'all';

export interface SearchQuery {
query: string;
type?: SearchType;
filters?: SearchFilters;
page?: number;
limit?: number;
}

export interface SearchFilters {
dateFrom?: string;
dateTo?: string;
section?: string;
tags?: string[];
}

export interface SearchResult {
id: string;
type: SearchType;
title: string;
excerpt: string;
url: string;
relevance: number;
highlighted: string;
}

6.2 Примеры поисковых запросов
✅ "документ положение о секции"
✅ "записать в футбольную секцию"
✅ "тренер по плаванию"
✅ "расписание занятий"
✅ "победители 2024"
✅ "контакты администрации"


♿ 7. Детальная спецификация доступности
7.1 Уровни доступности
// src/types/accessibility.ts
export type AccessibilityLevel = 'A' | 'AA' | 'AAA';

export interface AccessibilitySettings {
fontSize: number;           // 12-24px
fontScale: number;          // 0.8-2.0
contrast: ContrastMode;
zoom: number;               // 1-3
voiceEnabled: boolean;
voiceRate: number;          // 0.5-2.0
magnifierEnabled: boolean;
magnifierZoom: number;      // 2-10
}

export type ContrastMode = 'normal' | 'high' | 'dark' | 'light';
7.2 Горячие клавиши
// src/utils/keyboard-shortcuts.ts
export const accessibilityShortcuts = {
toggleMagnifier: 'Alt+M',
increaseFontSize: 'Alt++',
decreaseFontSize: 'Alt+-',
toggleContrast: 'Alt+C',
toggleVoice: 'Alt+V',
openSearch: 'Ctrl+K',
};





