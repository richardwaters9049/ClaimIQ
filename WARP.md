# Project Overview

ClaimIQ is an AI-powered insurance claims processing platform with a Flask backend and Next.js frontend.

## Development Commands

### Docker (Recommended)

Start all services (backend, frontend, PostgreSQL, Redis):

```bash
docker-compose up -d
```

Stop all services:

```bash
docker-compose down
```

View logs:

```bash
docker-compose logs -f [service_name]
```

Rebuild after dependency changes:

```bash
docker-compose up -d --build
```

### Backend (Flask)

Navigate to backend directory for all backend commands:

```bash
cd backend
```

Run development server (without Docker):

```bash
python wsgi.py
# or with Flask CLI
flask run --debug
```

Run tests:

```bash
pytest
# With coverage
pytest --cov=app
```

Database operations (using Alembic):

```bash
# Generate migration
flask db revision --autogenerate -m "Description"

# Apply migrations
flask db upgrade

# Rollback migration
flask db downgrade
```

Celery worker:

```bash
celery -A app.celery worker --loglevel=info
```

### Frontend (Next.js)

Navigate to frontend directory for all frontend commands:

```bash
cd frontend
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run production build:

```bash
npm run start
```

Lint code:

```bash
npm run lint
```

## Architecture

### Backend Architecture

**Application Factory Pattern:**

- Entry point: `backend/wsgi.py`
- Application factory: `backend/app/__init__.py` (creates and configures Flask app)
- Configuration: `backend/app/config.py` (uses pydantic-settings for type-safe config)

**Core Components:**

- **Database:** SQLAlchemy ORM with PostgreSQL
- **Authentication:** JWT tokens via Flask-JWT-Extended
- **Task Queue:** Celery with Redis broker for background processing
- **Rate Limiting:** Flask-Limiter with Redis storage
- **Security:** Flask-Talisman for security headers, CORS configured per environment

**API Structure:**

- Base path: `/api` (configured in `main.py` blueprint)
- Health check: `/health` (exempt from rate limiting)
- Blueprints registered in `app/__init__.py`

**Extensions Initialized:**

- `db` (SQLAlchemy)
- `jwt` (JWTManager)
- `limiter` (Limiter)
- `celery` (Celery)

**Environment-Specific Behavior:**

- Development: Debug logging, permissive CORS, no forced HTTPS
- Production: Security headers enabled, strict CORS, HTTPS enforced, ProxyFix middleware

**AI/NLP Module:**

- Located at `backend/app/ai/nlp.py`
- Currently empty stub for future ML features

### Frontend Architecture

**Framework:** Next.js 15.5.6 with App Router (not Pages Router)

**Key Directories:**

- `app/` - Next.js App Router pages and layouts
  - `page.tsx` - Dashboard (home page)
  - `claims/` - Claims management
  - `analytics/` - Analytics dashboard
  - `help/` - Help/support
  - `settings/` - Settings page
  - `layout.tsx` - Root layout with Sidebar
- `components/` - React components
  - `ui/` - Reusable UI components (shadcn/ui style with Radix UI primitives)
  - `page-transition.tsx` - Page transition wrapper
- `hooks/` - Custom React hooks
  - `use-mobile.ts` - Mobile detection
  - `use-media-query.ts` - Media query hook
- `lib/` - Utility functions
  - `utils.ts` - Helper utilities

**UI Components Library:**

- Based on shadcn/ui patterns using Radix UI primitives
- Styled with Tailwind CSS v4
- Includes: Button, Card, Dialog, Select, Table, Tooltip, etc.

**Animation:**

- Framer Motion for page transitions and UI animations
- Motion variants defined per component for consistent animation patterns

**Styling:**

- Tailwind CSS v4 with custom configuration
- Geist and Geist Mono fonts
- Dark mode ready (slate color scheme)

**API Integration:**

- Backend API URL configured via `NEXT_PUBLIC_API_URL` environment variable
- Currently points to `http://backend:5000/api` in Docker Compose

### Database & Task Queue

**PostgreSQL:**

- Database: `claimiqdb`
- Managed via SQLAlchemy with Alembic migrations (when configured)
- Connection pooling configured (pool_size=20, max_overflow=10)

**Redis:**

- Used for three purposes:
  1. Celery broker (task queue)
  2. Celery result backend
  3. Rate limiting storage
- Separate Redis databases for each purpose (configured in `.env`)

**Celery Configuration:**

- Task serialization: JSON
- Timezone: UTC
- Task time limit: 30 minutes (hard), 25 minutes (soft)
- Worker recycling: After 100 tasks
- Fair task distribution (prefetch_multiplier=1)

## Environment Configuration

Backend requires `.env` file in `backend/` directory. Copy `backend/.env.example` and configure:

**Required Variables:**

- `SECRET_KEY` - Flask secret key
- `JWT_SECRET_KEY` - JWT signing key
- `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database credentials
- `DATABASE_URL` - Full database connection string

**Optional Variables:**

- `CELERY_BROKER_URL` - Redis URL for Celery broker
- `CELERY_RESULT_BACKEND` - Redis URL for task results
- `RATELIMIT_STORAGE_URI` - Redis URL for rate limiting
- `CORS_ORIGINS` - Comma-separated allowed origins
- `SENTRY_DSN` - Sentry error tracking (if used)

Frontend can optionally use `.env.local` for:

- `NEXT_PUBLIC_API_URL` - Backend API endpoint

## Development Guidelines

### Backend Code Organization

- Place route handlers in separate blueprint modules under `backend/app/`
- Register new blueprints in `app/__init__.py`
- Use `app/models.py` for SQLAlchemy models
- Use `app/schemas.py` for Pydantic validation schemas
- Place background tasks in `app/tasks.py` (decorated with `@celery.task`)
- AI/ML code goes in `app/ai/` module

### Frontend Code Organization

- Pages go in `app/` directory (App Router convention)
- Shared components in `components/`
- UI primitives in `components/ui/`
- Custom hooks in `hooks/`
- Utilities in `lib/`
- Use TypeScript for all new files
- Prefer "use client" directive only when necessary (forms, state, effects)

### Testing

Backend tests should go in `backend/tests/` directory. Use pytest fixtures for database and app setup.

Frontend currently has no test configuration. If adding tests, consider Vitest or Jest with React Testing Library.

## Port Reference

- Frontend Backend API: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Common Issues

**Database Connection Errors:**

- Ensure PostgreSQL is running (via Docker Compose or locally)
- Verify `DATABASE_URL` in backend `.env`
- Check if migrations need to be applied

**Celery Tasks Not Running:**

- Ensure Redis is running
- Start Celery worker: `celery -A app.celery worker --loglevel=info`
- Check `CELERY_BROKER_URL` configuration

**Frontend API Connection:**

- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` environment variable
- CORS may block requests if origins not configured in backend `.env`
