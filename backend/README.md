# The Last of Guss - Backend

Backend для браузерной игры "The Last of Guss".

## Установка

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## Запуск

```bash
npm run build
npm start
```

Для разработки:
```bash
npm run dev
```

## Переменные окружения

Создайте файл `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/the_last_of_guss"
JWT_SECRET="your-secret-key-here"
ROUND_DURATION=60
COOLDOWN_DURATION=30
PORT=3000
```

## API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход/регистрация
- `POST /api/auth/logout` - Выход
- `GET /api/auth/me` - Информация о пользователе

### Раунды
- `GET /api/rounds` - Список раундов
- `GET /api/rounds/:id` - Информация о раунде
- `POST /api/rounds` - Создание раунда (только админ)

### Игровой процесс
- `POST /api/tap` - Тап по гусю

## База данных

Используется PostgreSQL с Prisma ORM.

### Миграции

```bash
npx prisma migrate dev
npx prisma studio
```
