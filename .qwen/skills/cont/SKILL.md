# Скилл: Разработка веб-приложения для СДЮШОР "Олимпиец"

## Предпочтения пользователя

### Структура проекта
- **Каждый компонент в отдельной папке** с файлами: `component.tsx`, `component.stories.tsx`, `component.styles.css` (если нужны)
- **Стили в компонентах** (Tailwind классы в JSX), отдельные CSS файлы только для глобальных стилей
- **Storybook** с `@storybook/nextjs-vite` (но лучше `@storybook/react-vite` для совместимости)

### UI Компоненты
- Использовать **shadcn/ui подход** (class-variance-authority, cn утилита)
- Все стили через **Tailwind CSS**
- Компоненты: Button, Card, Input, Select, Dialog, Label
- Экспорты через `index.ts`

### Layout Компоненты
- Header, Footer, MobileNav, Breadcrumbs, Sidebar
- Навигация через `mainNavigation` массив
- **Обработчики в отдельные функции** (не inline arrow функции)
- `handleLinkClick` с `e.preventDefault()` для Storybook

### Доступность (Accessibility)
- **AccessibilityPanel** — плавающая панель настроек
- **TextResizer** — изменение размера текста (12-24px)
- **ContrastToggle** — 3 режима (normal, high, dark)
- **ThemeToggle** — светлая/тёмная тема с предупреждением при включённом контрасте
- **Magnifier** — отложено (проблемы с производительностью)

### Store (Zustand)
- `accessibility-store.ts` с persist в localStorage
- Настройки: fontSize, fontScale, contrast, zoom, magnifier*, voice*

### Стили
- **CSS переменные** для темизации в `globals.css`
- `@layer base` для дефолтных значений
- `!important` для переопределения Tailwind классов
- Контраст через `body.contrast-high/dark` классы

### Storybook
- Декораторы для применения настроек из localStorage
- `useAccessibilityStore.subscribe()` для отслеживания изменений
- Истории с viewport (mobile, tablet)
- Интерактивные тесты с чеклистами

### ESLint
- Отключить `react-hooks/set-state-in-effect` (ложные срабатывания)
- `@typescript-eslint/no-unused-vars` → warn

### Git
- Коммиты на русском языке
- Подробные описания изменений
- Структура: `type(scope): сообщение`

## Технические решения

### Контраст
```css
body.contrast-high * {
  --background: 0 0% 100% !important;
  --foreground: 0 0% 0% !important;
  background-color: hsl(var(--background)) !important;
  color: hsl(var(--foreground)) !important;
}
```

### Размер шрифта
```tsx
// В provider
body.style.setProperty('font-size', `${fontSize}px`, 'important');
const textElements = body.querySelectorAll('p, span, h1, ...');
textElements.forEach(el => {
  (el as HTMLElement).style.setProperty('font-size', `${fontSize}px`, 'important');
});
```

### ThemeToggle
- Проверка `contrast !== 'normal'` перед сменой темы
- Предупреждение при попытке смены

### MobileNav
- Закрытие по ESC и resize (≥1024px)
- Анимация: `slide-in-from-right duration-300`
- `scrollbar-hide` класс

## Избегать
- ❌ html2canvas (медленный, 15 FPS)
- ❌ Canvas для лупы (CORS ограничения)
- ❌ Inline arrow функции в onClick
- ❌ Console.log в продакшене
- ❌ Отдельные CSS файлы для компонентов (если можно Tailwind)

## Предпочитаемые решения
- ✅ CSS zoom для увеличения
- ✅ ClassList для переключения классов
- ✅ QuerySelectorAll для массового применения стилей
- ✅ SetProperty с 'important' флагом
- ✅ Zustand persist для localStorage
