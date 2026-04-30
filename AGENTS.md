# Repository Guidelines

## Project Structure & Module Organization

CookieVault has three main modules. `client/` is the React + Vite frontend; app code is in `client/src/`, public assets in `client/public/`, and generated downloads in `client/public/downloads/` (ignored by git). `server/` is the Laravel 12 API; controllers, requests, services, models, routes, migrations, tests, policies, and factories live under `server/app/`, `server/routes/`, `server/database/`, and `server/tests/`. `extension/` contains the Chrome Manifest V3 extension (`manifest.json`, `popup.js`, `background.js`, styles, and icons). Build helpers live in `scripts/`.

## Build, Test, and Development Commands

- `cd client && npm run dev`: start the Vite frontend dev server.
- `cd client && npm run build`: build the frontend for production.
- `cd client && npm run lint`: run ESLint over frontend code.
- `cd client && npm test`: run Vitest tests for frontend.
- `cd client && npm run test:watch`: run Vitest in watch mode.
- `cd client && npm run build:extension`: package the extension on Linux/macOS.
- `cd client && npm run build:extension:win`: package the extension on Windows via PowerShell.
- `cd server && composer run dev`: run Laravel server, queue listener, and Vite together.
- `cd server && composer test`: clear config and run Laravel/Pest tests.

## Coding Style & Naming Conventions

Use PHP 8.2+ with strict typing where existing files do. Keep Laravel controllers thin; delegate business logic to services and validation to Form Requests. Use authorization policies for access control. Prefer Laravel's unique validation rules over manual duplicate checks. Use PascalCase for PHP classes and camelCase for methods and variables. React components use PascalCase filenames; hooks use `useXxx`. Prefer explicit validation, avoid unsafe `innerHTML`, and keep extension code compatible with Manifest V3 CSP.

## Testing Guidelines

Server tests use Laravel’s test runner with Pest/PHPUnit support and default to MySQL database `cookievault_test`. Create it locally before running `composer test`, or override `DB_*` variables in `phpunit.xml`/environment. Place feature tests in `server/tests/Feature/` and unit tests in `server/tests/Unit/`. Name tests after behavior, for example `CookieApiTest.php`. Unit tests should cover policies (`CookiePolicyTest`), form request validation (`StoreCookieRequestTest`), and services (`CookieServiceTest`). For frontend changes, run `npm test` to execute Vitest tests and `npm run lint` to check code style. Client tests should cover component behavior, form validation, error handling, and user interactions. For extension changes, manually verify the affected UI flow in Chrome.

## Commit & Pull Request Guidelines

History uses short imperative messages, often Conventional Commit style such as `feat: enhance cookie management`. Prefer `feat:`, `fix:`, `chore:`, or `docs:` prefixes. PRs should include a concise summary, affected areas (`client`, `server`, `extension`), test results, linked issues when applicable, and screenshots or recordings for UI changes.

## Security & Configuration Tips

Never commit `.env` files, tokens, generated downloads, `vendor/`, or `node_modules/`. Configure extension builds through `extension/.env` or environment variables (`API_URL`, `FRONTEND_URL`). Keep auth endpoints rate-limited, validate all cookie payloads server-side, and store sensitive cookie values encrypted through the Laravel model.
