# Cookie Manager

A full-stack cookie management application with a **Laravel 12 API** backend and a **React 19 SPA** frontend.

## Tech Stack

### Backend (`server/`)

- **Laravel 12** with Octane (FrankenPHP)
- **Laravel Sanctum** for token-based API authentication
- **MySQL** database
- Service pattern architecture with Form Requests for validation

### Frontend (`client/`)

- **React 19** with React Router v7
- **Tailwind CSS v4**
- **Vite 7** (Bun)
- Custom hooks pattern (`useAuth`, `useCookies`) with shared API client

## Recent Frontend Updates

- Monochrome UI refresh across Home, Login, and Dashboard pages
- Dark mode is now the default theme
- Theme toggle cycle was removed from the app shell
- Cookie cards now include a **Copy Cookie Value** action
- Cookie card icon containers use circular styling
- Modal overlays use a black translucent backdrop (no blur)

## Getting Started

### Server

```bash
cd server
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Client

```bash
cd client
bun install
bun run dev
```

## API Endpoints

| Method | Endpoint                | Auth | Description            |
| ------ | ----------------------- | ---- | ---------------------- |
| POST   | `/api/login`            | No   | Login                  |
| POST   | `/api/register`         | No   | Register               |
| POST   | `/api/logout`           | Yes  | Logout                 |
| GET    | `/api/user`             | Yes  | Get authenticated user |
| GET    | `/api/cookies`          | Yes  | List all cookies       |
| POST   | `/api/cookies`          | Yes  | Create a cookie        |
| GET    | `/api/cookies/{cookie}` | Yes  | Get a cookie           |
| PUT    | `/api/cookies/{cookie}` | Yes  | Update a cookie        |
| DELETE | `/api/cookies/{cookie}` | Yes  | Delete a cookie        |
