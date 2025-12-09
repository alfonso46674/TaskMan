# TaskMan Backend Deployment

## Environment Variables

Backend configuration is driven by environment variables. Copy `backend/.env.example` to `.env` or supply variables directly:

- `NODE_ENV`: Environment name (e.g. `production`, `development`).
- `PORT`: Port the API listens on (default: `4674`).
- `HOST`: Host binding (default: `0.0.0.0`).
- `DB_TYPE`: `sqlite` (default) or `postgresql`.
- `SQLITE_PATH`: File path for the SQLite database (default: `/app/server/data/tasks.db`).
- `DATABASE_URL`: PostgreSQL connection string when `DB_TYPE=postgresql`.
- `PGSSLMODE`: Set to `require` to enable SSL for PostgreSQL connections.
- `CORS_ORIGIN`: Allowed origin for CORS requests.

## Docker

Build and run the production image for the backend only:

```bash
docker build -f backend/Dockerfile -t taskman-backend .
docker run --env-file backend/.env.example -p 4674:4674 taskman-backend
```

The container exposes `/test` as a health endpoint and logs to stdout/stderr. Mount a volume to `/app/server/data` to persist the SQLite database when using the default configuration.

## Docker Compose (development)

A `docker-compose.yml` file is provided for local development with hot reload and a PostgreSQL database:

```bash
docker-compose up --build
```

The compose configuration mounts your local `server/` directory for live code reloads, keeps `node_modules` inside the container, and creates named volumes for SQLite and PostgreSQL data. Adjust `backend/.env.example` or provide a `.env` file to switch between SQLite and PostgreSQL.

## Database Selection

The backend automatically chooses the database adapter based on `DB_TYPE`:

- `sqlite`: Uses the file at `SQLITE_PATH` and creates directories as needed.
- `postgresql`: Uses `DATABASE_URL`. If `DB_TYPE` is set to PostgreSQL but `DATABASE_URL` is missing, the server falls back to SQLite and logs a warning.

When migrating between databases, ensure your schema and data are migrated accordingly; this backend keeps the table definition compatible across both drivers.
