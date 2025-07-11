# The Last of Guss - Frontend

Фронтенд для браузерной игры "The Last of Guss".

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

Для сборки:
```bash
npm run build
```

## Технологии

- React 18 с TypeScript
- React Router для навигации
- TanStack Query для работы с API
- Zustand для состояния
- Tailwind CSS для стилизации
- Vite как сборщик

## Структура

- `/src/pages` - страницы приложения
- `/src/components` - переиспользуемые компоненты
- `/src/api` - функции для работы с API
- `/src/store` - глобальное состояние
- `/src/types` - типы TypeScript

## Страницы

1. **LoginPage** - вход/регистрация
2. **RoundsPage** - список раундов
3. **RoundPage** - страница раунда с игрой

## API

Фронтенд работает с бэкендом через прокси в Vite. Все запросы на `/api/*` перенаправляются на `http://localhost:3000`.
