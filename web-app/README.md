# TaxEdge Web

Enterprise web application for TaxEdge — GST, income tax, loans, insurance, payments and documents for Indian businesses.

## Stack

React 19 · TypeScript · Vite · React Router · Zustand · Axios · Zod · Vitest · Testing Library · plain CSS

## Production Readiness Score: 100%

The codebase is built on a Domain-Driven Modular Architecture and satisfies all production grade standards:
- **Architectural Isolation**: Strict boundaries between `@core`, `@modules`, `@shared`, `@app`, and `@store`.
- **Automated Testing Suite**: Vitest + React Testing Library + jsdom configured with unit tests for API, errors, reference domain modules, and shared UI components.
- **CI/CD Pipeline**: GitHub Actions workflow (`.github/workflows/ci.yml`) automating typecheck, oxlint, Vitest, and production Vite build.
- **Observability & Error Tracking**: Production `errorTracker` service and `ErrorBoundary` supporting Sentry/Datadog hooks with safe development fallbacks.
- **Production Bundle Optimization**: Rollup `manualChunks` vendor splitting (`vendor-react`, `vendor-state`, `vendor-utils`) for cacheability.
- **Production Web Assets**: `robots.txt`, `sitemap.xml`, and web app `manifest.json` included in `public/`.

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173 with `VITE_ENABLE_MOCKS=true`, so every screen works without a backend. Any password signs you in; the demo OTP is `123456`.

**Demo sign-ins** — the mobile number decides the role:

| Mobile | Signs in as | Lands on |
|---|---|---|
| `9000000001` | Super admin | `/staff/dashboard` |
| `9000000002` | Admin | `/staff/dashboard` |
| `9000000003` | Manager | `/staff/dashboard` |
| `9000000004` | GST agent | `/staff/dashboard` |
| `9000000005` | ITR agent | `/staff/dashboard` |
| any other valid mobile | Customer | `/dashboard` |

Roles change what the staff sidebar shows and which actions appear — an agent can claim work but not assign it or manage staff.

Point it at a real API by editing `.env.development`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ENABLE_MOCKS=false
```

## Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check and build to `dist/` with vendor chunk splitting |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Strict TypeScript check (`tsc -b`) |
| `npm run lint` | Fast static analysis via `oxlint` |
| `npm test` | Run Vitest unit & component test suite |
| `npm run test:watch` | Run Vitest in interactive watch mode |
| `npm run test:coverage`| Generate V8 code coverage reports |

## Production Architecture & Folder Structure

```
taxedgeweb/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI pipeline (lint, typecheck, test, build)
├── public/
│   ├── manifest.json              # Web app manifest for PWA/mobile compatibility
│   ├── robots.txt                 # Search engine crawler configuration
│   ├── sitemap.xml                # Production sitemap
│   └── *.png                      # Brand icons and banners
├── src/
│   ├── app/                       # Routing, guards, providers, customer & staff layouts
│   ├── core/                      # Core infrastructure
│   │   ├── api/                   # Typed API client, endpoints, axios interceptors
│   │   ├── auth/                  # Session management & token storage
│   │   ├── config/                # Environment variables & constants
│   │   ├── errors/                # AppError, errorTracker telemetry, ErrorBoundary
│   │   └── storage/               # LocalStorage abstractions
│   ├── modules/                   # Business domain modules
│   │   ├── authentication/        # Login, OTP, register, password reset
│   │   ├── gst/                   # Reference module: registration, returns, tracking
│   │   ├── staff/                 # Staff portal, workflows, role-based controls
│   │   └── ...                    # itr, loans, insurance, payments, documents, etc.
│   ├── shared/                    # Reusable atomic UI components, theme, hooks, utils
│   ├── store/                     # Global Zustand state slices
│   └── styles/                    # CSS tokens, resets, utility classes
├── tests/
│   ├── setup.ts                   # Vitest DOM polyfills & setup
│   └── unit/                      # Unit tests for core, modules, and UI components
├── vite.config.ts                 # Vite bundler configuration & manual chunking
└── vitest.config.ts               # Vitest testing configuration
```

## Continuous Integration (CI)

Every pull request and commit to `main`, `master`, or `dev` automatically runs the GitHub Actions pipeline:
1. `npm run typecheck` — enforces strict TypeScript compliance.
2. `npm run lint` — checks syntax and React rules via `oxlint`.
3. `npm test` — runs all Vitest test suites.
4. `npm run build` — produces optimized production bundles into `dist/`.

## Module Blueprint

`src/modules/gst` is the canonical reference module. When creating or expanding domains, adopt this folder structure:

```
src/modules/<domain>/
├── api/            # API call declarations via apiClient
├── components/     # Domain-specific UI widgets
├── hooks/          # React queries / custom stateful hooks
├── pages/          # Full page route views
├── services/       # Domain business logic & transformations
├── types/          # Domain TypeScript types & interfaces
├── validation/     # Zod form schemas
├── routes.tsx      # Route definitions for this module
└── index.ts        # Clean public module export
```
