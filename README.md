# Aggimalla Abhishek Portfolio

A modern full-stack portfolio for a Computer Science / Data Science student, built with FastAPI, React, Tailwind CSS, PostgreSQL, JWT auth, and Docker.

## Highlights

- Public portfolio with hero, about, projects, timeline, blog, contact, GitHub activity, theme toggle, and responsive layout
- FastAPI backend with JWT admin authentication, image uploads, seeded profile data, CRUD APIs, and PostgreSQL models
- React admin dashboard for projects, blog posts, and contact message management
- Markdown-based blog authoring with live preview
- Dockerized deployment with Nginx reverse proxy, backend API, and PostgreSQL
- SEO metadata hooks and optional analytics integration

## Stack

- Frontend: React, TypeScript, Tailwind CSS, Vite, Framer Motion
- Backend: FastAPI, SQLAlchemy, Pydantic, python-jose, passlib
- Database: PostgreSQL
- Auth: JWT-based admin login
- Deployment: Docker Compose, Nginx

## Folder Structure

```text
.
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── db
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   └── utils
│   ├── .env.example
│   └── requirements.txt
├── database
│   └── schema.sql
├── docker
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── styles
│   │   └── types
│   ├── .env.example
│   └── package.json
├── .env.example
└── docker-compose.yml
```

## Local Development

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

The API starts on `http://localhost:8000`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The frontend starts on `http://localhost:5173`.

### 3. Database

Run PostgreSQL locally and make sure `DATABASE_URL` in `backend/.env` points at it. The FastAPI app creates tables on startup and seeds sample content plus the default admin account.

## Docker Setup

```bash
cp .env.example .env
docker compose up --build
```

Services:

- Frontend: `http://localhost`
- Backend API: proxied through `http://localhost/api/v1`
- PostgreSQL: `localhost:5432`

## Admin Credentials

Change these in `.env` or `backend/.env` before deploying publicly.

## Environment Variables

### Root `.env` for Docker

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DATABASE_URL`
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `BACKEND_CORS_ORIGINS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_FULL_NAME`
- `GITHUB_USERNAME`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `SMTP_TO_EMAIL`
- `SMTP_USE_TLS`

Note: `BACKEND_CORS_ORIGINS` should be a JSON array string, for example:
`["http://localhost:5173","http://localhost"]`

### Frontend `.env.local`

- `VITE_API_BASE_URL`
- `VITE_API_ASSET_URL`
- `VITE_SITE_URL`
- `VITE_SITE_NAME`
- `VITE_GA_MEASUREMENT_ID`
- `VITE_PLAUSIBLE_DOMAIN`

## API Overview

Public endpoints:

- `GET /api/v1/profile`
- `GET /api/v1/projects`
- `GET /api/v1/projects/{slug}`
- `GET /api/v1/experience`
- `GET /api/v1/blog/posts`
- `GET /api/v1/blog/posts/{slug}`
- `GET /api/v1/github/activity`
- `POST /api/v1/contact`

Auth endpoints:

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

Admin endpoints:

- `GET|POST|PUT|DELETE /api/v1/admin/projects`
- `GET|POST|PUT|DELETE /api/v1/admin/blog/posts`
- `GET|PUT|DELETE /api/v1/admin/messages`
- `POST /api/v1/admin/uploads/image`

## Database Schema

See [`database/schema.sql`](./database/schema.sql) for the PostgreSQL schema used by Docker initialization.

## Notes

- Image uploads are stored in `backend/uploads`.
- Contact form emails are sent only when SMTP variables are configured; otherwise messages are still stored in PostgreSQL.
- GitHub activity uses the public GitHub events API for `AggimallaAbhishek`.
- Analytics hooks support either Google Analytics or Plausible via frontend env vars.
