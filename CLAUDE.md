# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cookie manager — a monorepo with a **Laravel 12 API** (`server/`), a **React 19 SPA** (`client/`), and a **Chrome Extension** (`extension/`).

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

### Extension

```bash
# No build step - load directly in Chrome
# chrome://extensions → Developer mode → Load unpacked → extension/
```

## Architecture

### Server (`server/`)

- **Framework**: Laravel 12 with Octane (FrankenPHP) for high-performance serving
- **Auth**: Laravel Sanctum token-based API authentication
- **Database**: MySQL with 2 domain tables:
  - `users` — has `username` (unique), `name`, `email`, `password`
  - `cookies` — has `domain` (unique), `name` (unique), `value` (encrypted JSON), `path` (default `/`)
- **Encryption**: Cookie `value` is encrypted at rest using Laravel's `Crypt::encryptString()` / `Crypt::decryptString()` (AES-256-CBC). The `Cookie` model uses accessor/mutator to transparently encrypt on write and decrypt on read. Legacy plain-text data is handled with a try/catch fallback.
- **API response convention**: All responses go through `App\Traits\ApiResponse` — `{ code, message, data }` JSON format
- **Architecture**: Service pattern — controllers are thin, delegate to service classes:
  - Controllers: accept validated requests, call service, return JSON via `ApiResponse`
  - Services (`app/Services/`): contain business logic, interact with Eloquent models
  - Form Requests (`app/Http/Requests/`): handle validation rules
  - Uses `final class`, `declare(strict_types=1)`, readonly constructor properties
- **Routing**: `routes/api.php` defines all endpoints with route-model binding (`{cookie}` param):
  - Public: `POST /api/login`, `POST /api/register`
  - Auth-protected (Sanctum bearer token): `/api/cookies` CRUD, `/api/logout`, `/api/user`
- **Key files**:
  - `app/Http/Controllers/AuthController.php` — delegates to `AuthService`
  - `app/Http/Controllers/CookieController.php` — delegates to `CookieService`
  - `app/Services/AuthService.php` — login/logout/user logic
  - `app/Services/CookieService.php` — cookie CRUD logic
  - `app/Http/Requests/LoginRequest.php`, `StoreCookieRequest.php`, `UpdateCookieRequest.php`
  - `app/Models/Cookie.php` — encrypts/decrypts `value` via accessor/mutator
  - `app/Traits/ApiResponse.php` — `sendResponse()` and `sendError()` helpers

### Client (`client/`)

- **Framework**: React 19 with React Router v7, Tailwind CSS v4, Vite 7
- **Package manager**: Bun (has `bun.lock`, no `package-lock.json`)
- **Auth flow**: Login stores token in `localStorage` key `authToken`, sent as Bearer token. 401 responses auto-clear the token via shared `apiFetch` helper.
- **API base URL**: `VITE_API_URL` env var (default `http://localhost:8000`), set in `client/.env`
- **Architecture**: Custom hooks pattern — components are thin, business logic lives in hooks:
  - `src/api/client.js` — shared `apiFetch` wrapper (handles auth headers, 401 auto-clear)
  - `src/api/auth.js` — `loginApi`, `logoutApi`, `getUserApi`
  - `src/api/cookies.js` — `getCookiesApi`, `createCookieApi`, `updateCookieApi`, `deleteCookieApi`
  - `src/hooks/useAuth.js` — `login`, `logout` (calls API then clears token), `isAuthenticated`, `loading`
  - `src/hooks/useCookies.js` — `cookies`, `addCookie`, `updateCookie`, `deleteCookie`, `fetchLoading`, `mutating`
- **Routing**: 3 routes — `/` (Home), `/login` (public only), `/dashboard` (protected)
- **Key files**:
  - `src/pages/Dashboard.jsx` — uses `useCookies` hook, manages modals and search filtering
  - `src/pages/Home.jsx` — landing page with extension download
  - `src/components/Navbar.jsx` — uses `useAuth` hook for logout
  - `src/components/forms/LoginForm.jsx` — uses `useAuth` hook for login, password eye toggle
  - `src/components/auth/ProtectedRoute.jsx` — redirects unauthenticated users
  - `src/components/auth/PublicRoute.jsx` — redirects authenticated users away from login

### Extension (`extension/`)

- **Manifest V3** Chrome extension with `cookies`, `activeTab`, `storage` permissions
- **Incognito**: `"incognito": "spanning"` — shares auth token between normal and incognito
- **Cookie store**: Uses `chrome.cookies.getAllCookieStores()` to find the correct store for the current tab (critical for incognito support)
- **Auth**: Login stores token in `chrome.storage.local`, shared across modes
- **Key files**:
  - `popup.html` / `popup.css` / `popup.js` — main popup UI and logic
  - `background.js` — minimal service worker
  - `manifest.json` — extension configuration

### Conventions

- All API responses use the `{ code, message, data }` structure from `ApiResponse` trait
- Frontend components under `src/components/` organized by type: `auth/`, `cards/`, `forms/`, `modals/`, `ui/`
- Cookie `value` is encrypted at rest (AES-256) and cast to array via model accessor
- CORS is open (`*`) for `api/*` paths — configured in `config/cors.php`
- Server classes use `final class`, `declare(strict_types=1)`, and readonly constructor promotion
- Extension uses monochrome dark theme matching the web client
