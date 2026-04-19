# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cookie manager — a monorepo with a **Laravel 12 API** (`server/`) and a **React 19 SPA** (`client/`).

## Commands

### Server (Laravel)

```bash
cd server
php artisan serve          # Start dev server (port 8000)
php artisan migrate        # Run migrations
php artisan test           # Run Pest tests
./vendor/bin/pint          # Format PHP (Laravel Pint)
composer run dev           # Run server + queue + vite concurrently
```

### Client (React + Vite)

```bash
cd client
bun install                # Install dependencies
bun run dev                # Start Vite dev server
bun run build              # Production build (copies .htaccess to dist/)
bun run lint               # ESLint
```

## Architecture

### Server (`server/`)

- **Framework**: Laravel 12 with Octane (FrankenPHP) for high-performance serving
- **Auth**: Laravel Sanctum token-based API authentication
- **Database**: MySQL with 2 domain tables:
  - `users` — has `username` (unique), `name`, `email`, `password`
  - `cookies` — has `domain` (unique), `name` (unique), `value` (JSON), `path` (default `/`)
- **API response convention**: All responses go through `App\Traits\ApiResponse` — `{ code, message, data }` JSON format
- **Routing**: `routes/api.php` defines all endpoints:
  - Public: `POST /api/login`, `POST /api/register`
  - Auth-protected (Sanctum bearer token): `/api/cookies` CRUD, `/api/logout`, `/api/user`
- **Key files**:
  - `app/Http/Controllers/AuthController.php` — login returns `{ user, token }`
  - `app/Http/Controllers/CookieController.php` — full CRUD for cookies
  - `app/Models/Cookie.php` — casts `value` to array (JSON column)
  - `app/Traits/ApiResponse.php` — `sendResponse()` and `sendError()` helpers

### Client (`client/`)

- **Framework**: React 19 with React Router v7, Tailwind CSS v4, Vite 7
- **Package manager**: Bun (has `bun.lock`, no `package-lock.json`)
- **Auth flow**: Login stores token in `localStorage` key `authToken`, sent as Bearer token. 401 responses auto-clear the token.
- **API base URL**: `VITE_API_URL` env var (default `http://localhost:8000`), set in `client/.env`
- **Routing**: 3 routes — `/` (Home), `/login` (public only), `/dashboard` (protected)
- **Key files**:
  - `src/api/cookies.js` — all cookie API calls with auth headers
  - `src/api/auth.js` — login/logout API calls
  - `src/pages/Dashboard.jsx` — main page with cookie CRUD, search filtering, modals
  - `src/components/auth/ProtectedRoute.jsx` — redirects unauthenticated users
  - `src/components/auth/PublicRoute.jsx` — redirects authenticated users away from login

### Conventions

- All API responses use the `{ code, message, data }` structure from `ApiResponse` trait
- Frontend components under `src/components/` organized by type: `auth/`, `cards/`, `forms/`, `modals/`, `ui/`
- Cookie `value` is stored as JSON in the database and cast to array in Eloquent
- CORS is open (`*`) for `api/*` paths — configured in `config/cors.php`
