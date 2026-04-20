[Imgur](https://i.imgur.com/7aEIgNY.png)

# Cookie Manager

A full-stack cookie management application with a **Laravel 12 API** backend, a **React 19 SPA** frontend, and a **Chrome Extension** for seamless cookie import/export.

## Tech Stack

### Backend (`server/`)

- **Laravel 12** with Octane (FrankenPHP)
- **Laravel Sanctum** for token-based API authentication
- **MySQL** database with AES-256 encrypted cookie values
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

- **Encrypted Storage** — Cookie values are encrypted at rest using Laravel's `Crypt` facade (AES-256-CBC). Legacy plain-text data is handled transparently with automatic fallback.
- **Browser Extension** — Save and load cookies without manual copy-paste. Supports incognito mode via `getAllCookieStores()` for correct store detection.
- **One-Click Import** — Inject saved cookies into any site and auto-reload the page.
- **Search & Filter** — On-site tabs show domain-specific cookies. Blank tabs show all cookies with search.

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

### Extension

Load the `extension/` directory as an unpacked extension in Chrome:
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `extension/` folder
4. Enable **Allow in incognito** if needed

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

## Project Structure

```
cookie-manager/
├── server/          # Laravel 12 API
├── client/          # React 19 SPA
├── extension/       # Chrome Extension (Manifest V3)
├── .agents/         # PHP best practices skills
├── CLAUDE.md        # Claude Code guidance
└── README.md
```
