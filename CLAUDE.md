# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CookieVault — a monorepo with a **Laravel 12 API** (`server/`), a **React 19 SPA** (`client/`), and a **Chrome Extension** (`extension/`).

## Commands

### Server (Laravel)

```bash
cd server
php artisan serve          # Start dev server (port 8000)
php artisan migrate        # Run migrations
php artisan queue:work     # Run queue worker (for password reset emails)
php artisan test           # Run Pest tests
./vendor/bin/pint          # Format PHP (Laravel Pint)
composer run dev           # Run server + queue + vite concurrently
```

### Client (React + Vite)

```bash
cd client
bun install                # Install dependencies
bun run dev                # Start Vite dev server
bun run build              # Production build
bun run lint               # ESLint
```

### Extension

```bash
cd client
pnpm run build:extension   # Build extension zip (reads extension/.env)

# Alternative from repo root
./scripts/build-extension.sh

# For development
# chrome://extensions → Developer mode → Load unpacked → extension/
```

## Architecture

### Server (`server/`)

- **Framework**: Laravel 12 with Octane (FrankenPHP) for high-performance serving
- **Auth**: Laravel Sanctum token-based API authentication
- **Database**: MySQL with 3 domain tables:
  - `users` — has `name` (auto-set to username), `username` (unique, auto-generated from email), `email` (unique), `password`
  - `cookies` — has `domain` (unique), `name` (unique), `value` (encrypted TEXT), `path` (default `/`)
  - `password_reset_tokens` — standard Laravel table for reset tokens
- **Encryption**: Cookie `value` is encrypted at rest using `Crypt::encryptString()` / `Crypt::decryptString()` (AES-256-CBC). Model accessor/mutator handles transparent encrypt/decrypt with legacy plain-text fallback.
- **API response convention**: All responses go through `App\Traits\ApiResponse` — `{ code, message, data }` JSON format
- **Architecture**: Service pattern — controllers are thin, delegate to service classes:
  - Controllers: accept validated requests, call service, return JSON via `ApiResponse`
  - Services (`app/Services/`): contain business logic, interact with Eloquent models
  - Form Requests (`app/Http/Requests/`): handle validation rules
  - Uses `final class`, `declare(strict_types=1)`, readonly constructor properties
- **Routing** (`routes/api.php`):
  - Public: `POST /api/login`, `POST /api/register`, `POST /api/forgot-password`, `POST /api/reset-password`
  - Auth-protected (Sanctum bearer token): `/api/cookies` CRUD, `/api/logout`, `/api/user`, `PUT /api/profile`
- **Key files**:
  - `app/Http/Controllers/AuthController.php` — login, register, logout, user, forgotPassword, resetPassword
  - `app/Http/Controllers/CookieController.php` — CRUD for cookies
  - `app/Http/Controllers/ProfileController.php` — update email/password
  - `app/Services/AuthService.php` — login (email or username), register (auto-generate username), generateUsername()
  - `app/Services/CookieService.php` — cookie CRUD
  - `app/Services/PasswordResetService.php` — send reset link (queued), validate token, reset password
  - `app/Mail/ResetPassword.php` — ShouldQueue mailable with monochrome template
  - `app/Models/Cookie.php` — encrypts/decrypts `value` via accessor/mutator
  - `app/Models/User.php` — has `username` in fillable, Sanctum tokens
  - `app/Traits/ApiResponse.php` — `sendResponse()` and `sendError()` helpers
  - `resources/views/emails/reset-password.blade.php` — monochrome email template

### Client (`client/`)

- **Framework**: React 19 with React Router v7, Tailwind CSS v4, Vite 7
- **Package manager**: Bun (has `bun.lock`, no `package-lock.json`)
- **Auth flow**: Login stores token in `localStorage` key `authToken`, sent as Bearer token. 401 responses auto-clear the token via shared `apiFetch` helper. Login accepts email or username.
- **API base URL**: `VITE_API_URL` env var (default `http://localhost:8000`), set in `client/.env`
- **Architecture**: Custom hooks pattern:
  - `src/api/client.js` — shared `apiFetch` wrapper (handles auth headers, 401 auto-clear)
  - `src/api/auth.js` — `loginApi`, `registerApi`, `logoutApi`, `getUserApi`, `forgotPasswordApi`, `resetPasswordApi`, `updateProfileApi`
  - `src/api/cookies.js` — `getCookiesApi`, `createCookieApi`, `updateCookieApi`, `deleteCookieApi`
  - `src/hooks/useAuth.js` — `login`, `logout`, `user` (fetched from API), `fetchUser`, `isAuthenticated`, `loading`
  - `src/hooks/useCookies.js` — `cookies`, `addCookie`, `updateCookie`, `deleteCookie`, `fetchLoading`, `mutating`
- **Routing**: `/` (Home), `/login` (public), `/register` (public), `/forgot-password` (public), `/reset-password` (public), `/dashboard` (protected)
- **Key files**:
  - `src/pages/Dashboard.jsx` — cookie management with modals and search
  - `src/pages/Home.jsx` — landing page with extension download
  - `src/pages/Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx` — auth pages
  - `src/components/Navbar.jsx` — avatar with username initial, dropdown with Profile/Logout
  - `src/components/modals/ProfileModal.jsx` — update email/password with tabs
  - `src/components/forms/LoginForm.jsx` — email or username + password + eye toggle + links
  - `src/components/forms/RegisterForm.jsx` — email + password + confirm (no name/username fields)
  - `src/components/forms/ForgotPasswordForm.jsx`, `ResetPasswordForm.jsx`
  - `src/components/auth/ProtectedRoute.jsx` — redirects unauthenticated users
  - `src/components/auth/PublicRoute.jsx` — redirects authenticated users away from auth pages

### Extension (`extension/`)

- **Manifest V3** Chrome extension with `cookies`, `activeTab`, `storage` permissions
- **Incognito**: `"incognito": "spanning"` — shares auth token between normal and incognito
- **Cookie store**: Uses `chrome.cookies.getAllCookieStores()` to find correct store for current tab (critical for incognito)
- **Auth**: Login with email or username, token in `chrome.storage.local`
- **Key files**:
  - `popup.html` / `popup.css` / `popup.js` — popup UI and logic
  - `background.js` — minimal service worker
  - `manifest.json` — extension configuration

### Conventions

- All API responses use the `{ code, message, data }` structure from `ApiResponse` trait
- Frontend components under `src/components/` organized by type: `auth/`, `cards/`, `forms/`, `modals/`, `ui/`
- Cookie `value` is encrypted at rest (AES-256) and cast to array via model accessor
- CORS is open (`*`) for `api/*` paths — configured in `config/cors.php`
- Server classes use `final class`, `declare(strict_types=1)`, and readonly constructor promotion
- Extension uses monochrome dark theme matching the web client
- Password reset emails are queued via `ShouldQueue`
- Username is auto-generated from email (part before @), with numeric suffix for duplicates
