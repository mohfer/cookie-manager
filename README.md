<p align="center">
    <img src="https://i.imgur.com/mBdxfQe.png" alt="CookieVault Preview" width="600">
</p>

# CookieVault

A full-stack cookie management application with a **Laravel 12 API** backend, a **React 19 SPA** frontend, and a **Chrome Extension** for seamless cookie import/export.

## Tech Stack

### Backend (`server/`)

- **Laravel 12** with Octane (FrankenPHP)
- **Laravel Sanctum** for token-based API authentication
- **MySQL** database with AES-256 encrypted cookie values
- Queued emails via `ShouldQueue` for password reset
- Service pattern architecture with Form Requests for validation
- PHP 8.4 with strict types, readonly properties, and constructor promotion

### Frontend (`client/`)

- **React 19** with React Router v7
- **Tailwind CSS v4** — monochrome dark theme
- **Vite 7** (Bun)
- Custom hooks pattern (`useAuth`, `useCookies`) with shared API client

### Chrome Extension (`extension/`)

- **Manifest V3** — works in normal and incognito mode
- Save cookies from any site directly to the backend
- Load/inject saved cookies with one click
- Auto-filter by current domain, search across all saved cookies
- Monochrome dark UI matching the web app

## Features

- **Encrypted Storage** — Cookie values are encrypted at rest using Laravel's `Crypt` facade (AES-256-CBC)
- **Browser Extension** — Save and load cookies. Supports incognito mode via `getAllCookieStores()`
- **One-Click Import** — Inject saved cookies into any site and auto-reload the page
- **Search & Filter** — On-site tabs show domain-specific cookies. Blank tabs show all cookies with search

## Getting Started

### Server

```bash
cd server
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve

# For password reset emails
php artisan queue:work
```

### Client

```bash
cd client
bun install
bun run dev
```

### Extension

Configure extension endpoints in `extension/.env`:

```env
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

Build extension zip:

```bash
./scripts/build-extension.sh
```

Or from client folder:

```bash
cd client
pnpm run build:extension
```

Output zip: `client/public/downloads/cookie-vault-extension.zip`

For development, load the unpacked extension directly from `extension/`:
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `extension/` folder
4. Enable **Allow in incognito** if needed

The popup also includes an **Open Dashboard** button that opens the frontend dashboard URL configured at build time.

## API Endpoints

| Method | Endpoint                 | Auth | Description              |
| ------ | ------------------------ | ---- | ------------------------ |
| POST   | `/api/register`          | No   | Register (email+password)|
| POST   | `/api/login`             | No   | Login (email or username)|
| POST   | `/api/logout`            | Yes  | Logout                   |
| GET    | `/api/user`              | Yes  | Get authenticated user   |
| PUT    | `/api/profile`           | Yes  | Update email/password    |
| POST   | `/api/forgot-password`   | No   | Send reset link          |
| POST   | `/api/reset-password`    | No   | Reset password with token|
| GET    | `/api/cookies`           | Yes  | List all cookies         |
| POST   | `/api/cookies`           | Yes  | Create a cookie          |
| GET    | `/api/cookies/{cookie}`  | Yes  | Get a cookie             |
| PUT    | `/api/cookies/{cookie}`  | Yes  | Update a cookie          |
| DELETE | `/api/cookies/{cookie}`  | Yes  | Delete a cookie          |

## Project Structure

```
cookie-vault/
├── server/                         # Laravel 12 API
│   ├── app/Http/Controllers/       # AuthController, CookieController, ProfileController
│   ├── app/Services/               # AuthService, CookieService, PasswordResetService
│   ├── app/Mail/                   # ResetPassword (ShouldQueue)
│   ├── app/Models/                 # User, Cookie (encrypted value)
│   └── resources/views/emails/     # Reset password email template
├── client/                         # React 19 SPA
│   ├── src/api/                    # auth.js, cookies.js, client.js
│   ├── src/hooks/                  # useAuth, useCookies
│   ├── src/pages/                  # Home, Login, Register, ForgotPassword, ResetPassword, Dashboard
│   ├── src/components/             # Navbar (with profile avatar), modals, forms
│   └── public/downloads/           # Extension zip for download
├── extension/                      # Chrome Extension (Manifest V3)
│   ├── popup.html/css/js           # Main popup UI
│   ├── manifest.json               # Extension config (incognito: spanning)
│   └── background.js               # Service worker
├── .agents/                        # PHP best practices skills
├── CLAUDE.md
└── README.md
```
