<p align="center">
    <img src="https://i.imgur.com/mBdxfQe.png" alt="CookieVault Preview" width="600">
</p>

# CookieVault

CookieVault is a full-stack cookie management app with a Laravel API, React SPA, and Chrome Extension for saving, searching, and loading browser cookies.

## Tech Stack

- **Server:** Laravel 12, Sanctum token auth, MySQL, queued password reset emails, Pest/PHPUnit tests.
- **Client:** React 19, React Router 7, Vite 7, Tailwind CSS 4, Vitest + Testing Library.
- **Extension:** Chrome Manifest V3 popup/service worker with packaged ZIP builds.

## Features

- Encrypted cookie values at rest through Laravel `Crypt`.
- Token-based registration, login, logout, profile update, and password reset.
- Per-user cookie CRUD with domain/name validation and ownership checks.
- Extension support for saving current-site cookies and injecting saved cookies back into tabs.
- Downloadable extension ZIP generated into `client/public/downloads/`.

## Getting Started

### Server

```bash
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Run the queue worker when testing password reset emails locally:

```bash
php artisan queue:work
```

### Client

```bash
cd client
npm install
npm run dev
```

### Extension

Create `extension/.env` from your local endpoints:

```env
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

Build the downloadable extension ZIP:

```bash
# Linux/macOS
cd client && npm run build:extension

# Windows PowerShell
cd client; npm run build:extension:win
```

Output: `client/public/downloads/cookie-vault-extension.zip`. This folder is ignored by git.

For development, open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select `extension/`. Enable **Allow in incognito** if needed.

## Testing

### Client Tests

```bash
cd client
npm test
```

Client tests cover API wrappers, auth route guards, and key form behavior using Vitest and Testing Library.

### Server Tests

Server tests use MySQL, not SQLite. Create a dedicated test database first:

```sql
CREATE DATABASE cookievault_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Copy the local testing env template and fill in your own MySQL credentials. Do not commit `.env.testing`.

```bash
cd server
cp .env.testing.example .env.testing
php artisan key:generate --env=testing
composer test
```

Server tests cover auth flows, cookie CRUD, ownership isolation, validation, profile updates, token revocation, encrypted cookie model behavior, authorization policies, and duplicate prevention with unique constraints.

## API Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/register` | No | Register with email and password |
| POST | `/api/login` | No | Login with email or username |
| POST | `/api/logout` | Yes | Revoke current token |
| GET | `/api/user` | Yes | Get authenticated user |
| PUT | `/api/profile` | Yes | Update email or password |
| POST | `/api/forgot-password` | No | Queue reset email |
| POST | `/api/reset-password` | No | Reset password with token |
| GET | `/api/cookies` | Yes | List owned cookies |
| POST | `/api/cookies` | Yes | Create cookie entry |
| GET | `/api/cookies/{cookie}` | Yes | Show owned cookie |
| PUT | `/api/cookies/{cookie}` | Yes | Update owned cookie |
| DELETE | `/api/cookies/{cookie}` | Yes | Delete owned cookie |

## Project Structure

```text
CookieVault/
+-- client/                 # React SPA
|   +-- src/api/            # API wrappers and tests
|   +-- src/components/     # UI, forms, modals, auth guards
|   +-- src/hooks/          # useAuth, useCookies, theme hooks
|   +-- src/pages/          # route pages
|   +-- public/downloads/   # generated extension ZIPs (ignored)
+-- server/                 # Laravel API
|   +-- app/Http/           # controllers and Form Requests
|   +-- app/Services/       # auth, cookies, password reset logic
|   +-- app/Models/         # User and encrypted Cookie model
|   +-- database/           # migrations, factories, seeders
|   +-- tests/              # Pest/PHPUnit feature and unit tests
+-- extension/              # Chrome Manifest V3 extension
+-- scripts/                # Linux and PowerShell build scripts
+-- AGENTS.md               # contributor guidelines
```

## Security Notes

- Never commit `.env`, `.env.testing`, tokens, generated ZIP downloads, `vendor/`, or `node_modules/`.
- Keep test credentials in `server/.env.testing`; only `server/.env.testing.example` is committed.
- Cookie values are encrypted before storage, but API responses can expose decrypted values to authenticated owners.
- Extension rendering avoids injecting untrusted cookie data through dynamic HTML.
